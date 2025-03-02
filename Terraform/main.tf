terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.16.0"
    }
  }
}
provider "google" {
  project = "lexical-aquifer-445708-u1"  # Replace with your GCP project ID
  region  = "us-central1"       # Replace with your desired region
  zone    = "us-central1-c"     # Replace with your desired zone
}

resource "google_compute_instance" "fe" {
  name         = "fe"
  machine_type = "e2-micro"       # You can adjust the machine type as needed
  zone         = "us-central1-c"

  boot_disk {
    initialize_params {
      image = "https://www.googleapis.com/compute/v1/projects/debian-cloud/global/images/debian-12-bookworm-v20250212"
    }
  }
  enable_display             = false
  key_revocation_action_type = "NONE"
  network_interface {
        network                     = "https://www.googleapis.com/compute/v1/projects/lexical-aquifer-445708-u1/global/networks/my-vpc"
        network_ip                  = "10.0.0.2"
        queue_count                 = 0
        stack_type                  = "IPV4_IPV6"
        subnetwork                  = "https://www.googleapis.com/compute/v1/projects/lexical-aquifer-445708-u1/regions/us-central1/subnetworks/public-subnet"
        subnetwork_project          = "lexical-aquifer-445708-u1"
        # access_config {
        #     nat_ip       = 
        #      network_tier = 
        # }
  }
  service_account {
    email  = "472954461540-compute@developer.gserviceaccount.com"
    scopes = [
              "https://www.googleapis.com/auth/devstorage.read_only",
              "https://www.googleapis.com/auth/logging.write",
              "https://www.googleapis.com/auth/monitoring.write",
              "https://www.googleapis.com/auth/service.management.readonly",
              "https://www.googleapis.com/auth/servicecontrol",
              "https://www.googleapis.com/auth/trace.append",
            ]
  }
  shielded_instance_config {
    enable_integrity_monitoring = true
    enable_secure_boot          = false
    enable_vtpm                 = true
  }

}

resource "google_compute_instance" "be" {
  name         = "be"
  machine_type = "e2-micro"
  zone         = "us-central1-c"

  boot_disk {
    initialize_params {
      image = "https://www.googleapis.com/compute/v1/projects/debian-cloud/global/images/debian-12-bookworm-v20250212"
    }
  }
  enable_display             = false
  key_revocation_action_type = "NONE"
  network_interface {
        network                     = "https://www.googleapis.com/compute/v1/projects/lexical-aquifer-445708-u1/global/networks/my-vpc"
        network_ip                  = "10.0.1.2"
        queue_count                 = 0
        stack_type                  = "IPV4_IPV6"
        subnetwork                  = "https://www.googleapis.com/compute/v1/projects/lexical-aquifer-445708-u1/regions/us-central1/subnetworks/private-subnet"
        subnetwork_project          = "lexical-aquifer-445708-u1"
        # access_config {
        #     nat_ip       = 
        #      network_tier = 
        # }
  }
  service_account {
    email  = "472954461540-compute@developer.gserviceaccount.com"
    scopes = [
              "https://www.googleapis.com/auth/devstorage.read_only",
              "https://www.googleapis.com/auth/logging.write",
              "https://www.googleapis.com/auth/monitoring.write",
              "https://www.googleapis.com/auth/service.management.readonly",
              "https://www.googleapis.com/auth/servicecontrol",
              "https://www.googleapis.com/auth/trace.append",
            ]
  }
  shielded_instance_config {
    enable_integrity_monitoring = true
    enable_secure_boot          = false
    enable_vtpm                 = true
  }
  
}

resource "google_compute_instance" "database" {
  name         = "database"
  machine_type = "e2-micro"
  zone         = "us-central1-c"

  boot_disk {
    initialize_params {
      image = "https://www.googleapis.com/compute/v1/projects/debian-cloud/global/images/debian-12-bookworm-v20250212"
    }
  }
  enable_display             = false
  key_revocation_action_type = "NONE"
  network_interface {
        network                     = "https://www.googleapis.com/compute/v1/projects/lexical-aquifer-445708-u1/global/networks/my-vpc"
        network_ip                  = "10.0.1.3"
        queue_count                 = 0
        stack_type                  = "IPV4_IPV6"
        subnetwork                  = "https://www.googleapis.com/compute/v1/projects/lexical-aquifer-445708-u1/regions/us-central1/subnetworks/private-subnet"
        subnetwork_project          = "lexical-aquifer-445708-u1"
        # access_config {
        #     nat_ip       = 
        #      network_tier = 
        # }
  }
  service_account {
    email  = "472954461540-compute@developer.gserviceaccount.com"
    scopes = [
              "https://www.googleapis.com/auth/devstorage.read_only",
              "https://www.googleapis.com/auth/logging.write",
              "https://www.googleapis.com/auth/monitoring.write",
              "https://www.googleapis.com/auth/service.management.readonly",
              "https://www.googleapis.com/auth/servicecontrol",
              "https://www.googleapis.com/auth/trace.append",
            ]
  }
  shielded_instance_config {
    enable_integrity_monitoring = true
    enable_secure_boot          = false
    enable_vtpm                 = true
  }
}

resource "google_compute_instance" "ns1" {
  name         = "ns1"
  machine_type = "e2-micro"
  zone         = "us-central1-c"

  boot_disk {
    initialize_params {
      image = "https://www.googleapis.com/compute/v1/projects/debian-cloud/global/images/debian-12-bookworm-v20250113"
    }
  }
  enable_display             = false
  key_revocation_action_type = "NONE"
  network_interface {
        network                     = "https://www.googleapis.com/compute/v1/projects/lexical-aquifer-445708-u1/global/networks/my-vpc"
        network_ip                  = "10.0.3.2"
        queue_count                 = 0
        stack_type                  = "IPV4_IPV6"
        subnetwork                  = "https://www.googleapis.com/compute/v1/projects/lexical-aquifer-445708-u1/regions/us-central1/subnetworks/public-subnet-uscentral"
        subnetwork_project          = "lexical-aquifer-445708-u1"
        # access_config {
        #     nat_ip       = 
        #      network_tier = 
        # }
  }
  service_account {
    email  = "472954461540-compute@developer.gserviceaccount.com"
    scopes = [
              "https://www.googleapis.com/auth/devstorage.read_only",
              "https://www.googleapis.com/auth/logging.write",
              "https://www.googleapis.com/auth/monitoring.write",
              "https://www.googleapis.com/auth/service.management.readonly",
              "https://www.googleapis.com/auth/servicecontrol",
              "https://www.googleapis.com/auth/trace.append",
            ]
  }
  shielded_instance_config {
    enable_integrity_monitoring = true
    enable_secure_boot          = false
    enable_vtpm                 = true
  }
}


resource "google_compute_instance" "ns2" {
  name         = "ns2"
  machine_type = "e2-micro"
  zone         = "us-central1-c"

  boot_disk {
    initialize_params {
      image = "https://www.googleapis.com/compute/v1/projects/debian-cloud/global/images/debian-12-bookworm-v20250113"
    }
  }
  enable_display             = false
  key_revocation_action_type = "NONE"
  network_interface {
        network                     = "https://www.googleapis.com/compute/v1/projects/lexical-aquifer-445708-u1/global/networks/my-vpc"
        network_ip                  = "10.0.3.3"
        queue_count                 = 0
        stack_type                  = "IPV4_IPV6"
        subnetwork                  = "https://www.googleapis.com/compute/v1/projects/lexical-aquifer-445708-u1/regions/us-central1/subnetworks/public-subnet-uscentral"
        subnetwork_project          = "lexical-aquifer-445708-u1"
        # access_config {
        #     nat_ip       = 
        #      network_tier = 
        # }
  }
  service_account {
    email  = "472954461540-compute@developer.gserviceaccount.com"
    scopes = [
              "https://www.googleapis.com/auth/devstorage.read_only",
              "https://www.googleapis.com/auth/logging.write",
              "https://www.googleapis.com/auth/monitoring.write",
              "https://www.googleapis.com/auth/service.management.readonly",
              "https://www.googleapis.com/auth/servicecontrol",
              "https://www.googleapis.com/auth/trace.append",
            ]
  }
  shielded_instance_config {
    enable_integrity_monitoring = true
    enable_secure_boot          = false
    enable_vtpm                 = true
  }
}
