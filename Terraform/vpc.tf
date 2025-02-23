resource "google_compute_network" "firstvpc" {
  name                     = "firstvpc"
  auto_create_subnetworks  = false
  description              = "firstvpc"
  mtu                      = 1460
  enable_ula_internal_ipv6 = true
  internal_ipv6_range      = "fd20:987:e487:0:0:0:0:0/48"

  routing_mode = "REGIONAL"
}

resource "google_compute_subnetwork" "private-subnet2" {
  name                     = "private-subnet2"
  network                  = google_compute_network.firstvpc.self_link
  region                   = "asia-southeast1"
  ip_cidr_range            = "10.0.2.0/24"
  stack_type               = "IPV4_IPV6"
  ipv6_access_type         = "INTERNAL"
  private_ip_google_access = false
}

resource "google_compute_subnetwork" "public-subnet-uscentral" {
  name                     = "public-subnet-uscentral"
  network                  = google_compute_network.firstvpc.self_link
  region                   = "us-central1"
  ip_cidr_range            = "10.0.3.0/24"
  stack_type               = "IPV4_IPV6"
  ipv6_access_type         = "EXTERNAL"
  private_ip_google_access = false
}

resource "google_compute_subnetwork" "public-subnet" {
  name                     = "public-subnet"
  network                  = google_compute_network.firstvpc.self_link
  region                   = "asia-southeast1"
  ip_cidr_range            = "10.0.0.0/24"
  stack_type               = "IPV4_IPV6"
  ipv6_access_type         = "EXTERNAL"
  private_ip_google_access = true
  description              = "public-subnet"
}