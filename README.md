TRIỂN KHAI ỨNG DỤNG ĐA PHƯƠNG TIỆN TRÊN NỀN TẢNG IPV6
1. Giới thiệu chung
Báo cáo này trình bày việc xây dựng và triển khai một ứng dụng xem phim trực tuyến hoạt động trên cả IPv6 và IPv4 nhằm tận dụng không gian địa chỉ rộng lớn và tối ưu hóa hiệu suất mạng. Ứng dụng sử dụng Kubernetes để quản lý container, đảm bảo khả năng mở rộng, tính ổn định và hiệu suất cao.

2. Công nghệ sử dụng
Kubernetes: Quản lý container, hỗ trợ triển khai, giám sát, và mở rộng ứng dụng.
CI/CD (GitHub Actions, Jenkins): Tự động hóa quy trình phát triển, kiểm thử và triển khai.
Docker & Containerization: Đóng gói ứng dụng để dễ triển khai trên nhiều môi trường khác nhau.
Google Cloud Platform (GCP): Cung cấp hạ tầng triển khai ứng dụng.
Terraform: Quản lý cơ sở hạ tầng như GKE cluster và VPC.
Monitoring Tools (Grafana, Prometheus): Giám sát hiệu suất hệ thống.
SonarQube: Kiểm tra chất lượng mã nguồn.
BIND9 & Nginx: Xây dựng hệ thống phân giải tên miền và cân bằng tải.