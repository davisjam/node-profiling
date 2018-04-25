#!/usr/bin/env perl
# Author: Jamie Davis <davisjam@vt.edu>
# Description: Run the Node-DC-EIS benchmark for throughput and latency as a function of Node cluster size.

use strict;
use warnings;

# Modules
use Getopt::Long;
use JSON::PP;
use File::Basename;

# Scripts
my $root = "Node-DC-EIS";
my $serverDir = "$root/Node-DC-EIS-cluster";
my $clientDir = "$root/Node-DC-EIS-client";

my $server = "$serverDir/server-cluster.js";

my $client = "$clientDir/runspec.py";
my $clientConfig = "$clientDir/config.json";

for my $script ($server, $client, $clientConfig) {
  if (not -f $script) {
    die "Error, could not find $script\n";
  }
}

if (not @ARGV) {
  print "Usage: $0 { [--minCPUs M] [--maxCPUs N] | --onlyClient }\nExample: $0 --minCPUs 1 --maxCPUs `nproc`\n";
  exit 1;
}

# Args
my $minCPUs = 1;
my $maxCPUs = `nproc`; chomp $maxCPUs;
my $onlyClient = 0;

GetOptions ("minCPUs=i" => \$minCPUs,
            "maxCPUs=i" => \$maxCPUs,
            "onlyClient" => \$onlyClient,
           ) or die("Error in command line arguments\n");

&log("ARGS:");
&log("  minCPUs $minCPUs");
&log("  maxCPUs $maxCPUs");
&log("  onlyClient $onlyClient");

if ($onlyClient) {
  &log("Running client");
  my $performance = &runClient();
} else {
  # Run
  my @results;
  for (my $nCPUs = $minCPUs; $nCPUs <= $maxCPUs; $nCPUs++) {
    my $serverInfo;
    &log("Starting server with $nCPUs CPUs");
    $serverInfo = &startServer($nCPUs);
    &log("Started server with pid $serverInfo->{pid}");
  
    my $performance = &runClient();
    push @results, { "nCPUs" => $nCPUs, "performance" => $performance };
  
    &stopServer($serverInfo);
  }
  
  # Emit results as CSV for plotting
  print "************************\n";
  print "Results as a function of nWorkers\n";
  print "************************\n";
  my @performanceMetrics = keys %{$results[0]->{performance}};
  
  my @heading = ("nWorkers", @performanceMetrics);
  &printCSVRow(@heading);
  
  for my $result (@results) {
    my @fields;
    push @fields, $result->{nCPUs};
    for my $metric (@performanceMetrics) {
      push @fields, $result->{performance}->{$metric};
    }
    &printCSVRow(@fields);
  }
  print "************************\n";
}

&log("Done!");
exit 0;

##################

sub startServer {
  my ($nCPUs) = @_;
  
  my $pid = fork();
  if (not defined $pid) {
    die "fork failed: $!\n";
  }

  if ($pid) {
    # Parent: Wait a bit for server to start
    sleep 1;
    if (&processExists($pid)) {
      return { "pid" => $pid };
    } else {
      die "Error, server died\n";
    }
    
  } else {
    # Child: Start child
    $ENV{CPU_COUNT} = $nCPUs;
    chdir $serverDir; # server must be invoked in its dir
    my $_server = "./" . basename($server);
    exec("node", $_server);
    #exec "node $_server > /dev/null 2>&1" or die "Error, exec failed: $!\n";
  }
}

sub stopServer {
  my ($serverInfo) = @_;
  &cmd("kill -9 $serverInfo->{pid}"); 
}

sub runClient {
  my $_client = "./" . basename($client);
  my $_clientConfig = "./" . basename($clientConfig);

  my $out = &chkcmd("cd $clientDir; NODE_DC_EIS_RNG_SEED=10 $_client -f $_clientConfig 2>&1");
  if ($out =~ m/JSON-formatted result: <(.*)>/) {
    my $jsonResult = $1;
    return decode_json($jsonResult);
  } else {
    &log("Error, could not parse out $out\n");
    return {};
  }
}

sub processExists {
  my ($pid) = @_;

  # TODO This doesn't actually seem to work?
  if (kill(0, $pid) eq 1) {
    &log("processExists: $pid exists");
    return 1;
  }
  return 0;
}


sub cmd {
  my ($cmd) = @_;
  &log("$cmd");
  my $out = `$cmd`;
  my $rc = $? >> 8;

  return ($rc, $out);
}

sub chkcmd {
  my ($cmd) = @_;
  my ($rc, $out) = &cmd($cmd);
  if ($rc) {
    die "Error, cmd <$cmd> gave rc $rc:\n$out\n";
  }

  return $out;
}

sub log {
  my ($msg) = @_;
  my $now = localtime;
  print STDERR "$now: $msg\n";
}

sub printCSVRow {
  my (@row) = @_;
  print join(",", @row) . "\n";
}
