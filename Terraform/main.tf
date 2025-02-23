terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.16.0"
    }
  }
}

provider "google" {
  project     = "lexical-aquifer-445708-u1"
  region      = "asia-southeast1"
  credentials = "key.json"
}

resource "google_container_cluster" "autopilot-cluster-1" {
  name               = "autopilot-cluster-1"
  location           = "asia-southeast1-a" # Change to single zone
  initial_node_count = 1
  # enable_autopilot = false
  enable_l4_ilb_subsetting = true
  enable_tpu               = false
  resource_labels          = {}
  release_channel {
    channel = "REGULAR"
  }

  network    = "projects/lexical-aquifer-445708-u1/global/networks/firstvpc"
  subnetwork = "projects/lexical-aquifer-445708-u1/regions/asia-southeast1/subnetworks/public-subnet"

  ip_allocation_policy {
    stack_type = "IPV4_IPV6"
    pod_cidr_overprovision_config {
      disabled = false
    }
  }

  logging_config {
    enable_components = [
      "SYSTEM_COMPONENTS",
      "WORKLOADS",
    ]
  }

  master_auth {
    client_certificate_config {
      issue_client_certificate = false
    }
  }

  datapath_provider = "ADVANCED_DATAPATH"

  addons_config {
    horizontal_pod_autoscaling {
      disabled = false
    }
    http_load_balancing {
      disabled = false
    }
    gce_persistent_disk_csi_driver_config {
      enabled = true
    }
  }

  binary_authorization {
  }

  database_encryption {
    state = "DECRYPTED"
  }

  default_snat_status {
    disabled = false
  }

  control_plane_endpoints_config {
    dns_endpoint_config {
      allow_external_traffic = false
      endpoint               = "gke-57c0632afc0a43e1b4335c5ef7d6bd9cd61d-472954461540.asia-southeast1-a.gke.goog"
    }
  }

  monitoring_service = "monitoring.googleapis.com/kubernetes"
  logging_service    = "logging.googleapis.com/kubernetes"


  # node_config {
  #   disk_size_gb                = 100
  #   disk_type                   = "pd-balanced"
  #   enable_confidential_storage = false
  #   image_type                  = "COS_CONTAINERD"
  #   # labels                      = {}
  #   local_ssd_count             = 0
  #   logging_variant             = "DEFAULT"
  #   machine_type                = "e2-medium"
  #   metadata = {
  #     "disable-legacy-endpoints" = "true"
  #   }
  #   oauth_scopes = [
  #     "https://www.googleapis.com/auth/devstorage.read_only",
  #     "https://www.googleapis.com/auth/logging.write",
  #     "https://www.googleapis.com/auth/monitoring",
  #     "https://www.googleapis.com/auth/service.management.readonly",
  #     "https://www.googleapis.com/auth/servicecontrol",
  #     "https://www.googleapis.com/auth/trace.append"
  #   ]
  #   preemptible           = false
  #   # resource_labels       = {}
  #   resource_manager_tags = {}
  #   resource_labels = {
  #     "goog-gke-node-pool-provisioning-model" = "on-demand"
  #   }


  #   service_account = "terraform-svc@lexical-aquifer-445708-u1.iam.gserviceaccount.com"
  #   spot            = false
  #   storage_pools   = []
  #   tags            = []

  #   kubelet_config {
  #     cpu_cfs_quota                          = false
  #     insecure_kubelet_readonly_port_enabled = "TRUE"
  #     pod_pids_limit                         = 0
  #   }

  #   shielded_instance_config {
  #     enable_integrity_monitoring = true
  #     enable_secure_boot          = false
  #   }
  # }

  node_pool_defaults {
    node_config_defaults {
      insecure_kubelet_readonly_port_enabled = "FALSE"
      logging_variant                        = "DEFAULT"
    }
  }

  notification_config {
    pubsub {
      enabled = false
    }
  }

  private_cluster_config {
    enable_private_endpoint = false
    enable_private_nodes    = false

    master_global_access_config {
      enabled = false
    }
  }

  secret_manager_config {
    enabled = false
  }

  security_posture_config {
    mode               = "BASIC"
    vulnerability_mode = "VULNERABILITY_MODE_UNSPECIFIED"
  }

  service_external_ips_config {
    enabled = false
  }
  # deletion_protection = false

  # lifecycle {
  #   prevent_destroy = false
  # }
}

# =============================
# 🚀 Public Node Pool (FE Nodes)
# =============================
resource "google_container_node_pool" "fe-node-pool" {
  name     = "fe-node-pool"
  cluster  = google_container_cluster.autopilot-cluster-1.name
  location = "asia-southeast1-a"

  initial_node_count = 1
  max_pods_per_node  = 110

  autoscaling {
    min_node_count = 1
    max_node_count = 5
  }

  node_config {
    preemptible  = false
    machine_type = "e2-medium"
    image_type   = "COS_CONTAINERD"
    resource_labels = {
      "goog-gke-node-pool-provisioning-model" = "on-demand"
    }
    # Labels for identifying frontend nodes
    labels = {
      role = "frontend"
    }

    # Taints to ensure only FE workloads run on these nodes
    taint {
      key    = "role"
      value  = "frontend"
      effect = "NO_SCHEDULE"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/trace.append"
    ]

    service_account = "terraform-svc@lexical-aquifer-445708-u1.iam.gserviceaccount.com"

    shielded_instance_config {
      enable_integrity_monitoring = true
      enable_secure_boot          = false
    }
  }
}

# =============================
# 🔒 Private Node Pool (BE Nodes)
# =============================
resource "google_container_node_pool" "be-node-pool" {
  name     = "be-node-pool"
  cluster  = google_container_cluster.autopilot-cluster-1.name
  location = "asia-southeast1-a"

  initial_node_count = 1
  max_pods_per_node  = 110

  autoscaling {
    min_node_count = 1
    max_node_count = 5
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  network_config {
    create_pod_range     = true
    enable_private_nodes = true # Makes this node pool private
    pod_ipv4_cidr_block  = "10.112.0.0/14"
  }

  node_config {
    preemptible  = false
    machine_type = "e2-medium"
    image_type   = "COS_CONTAINERD"
    resource_labels = {
      "goog-gke-node-pool-provisioning-model" = "on-demand"
    }
    # Labels for identifying backend nodes
    labels = {
      role = "backend"
    }

    # Taints to ensure only BE workloads run on these nodes
    taint {
      key    = "role"
      value  = "backend"
      effect = "NO_SCHEDULE"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/service.management.readonly",
      "https://www.googleapis.com/auth/servicecontrol",
      "https://www.googleapis.com/auth/trace.append"
    ]

    service_account = "terraform-svc@lexical-aquifer-445708-u1.iam.gserviceaccount.com"

    shielded_instance_config {
      enable_integrity_monitoring = true
      enable_secure_boot          = false
    }
  }
}
