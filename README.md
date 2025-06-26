## **TRIỂN KHAI GIẢI PHÁP GIÁM SÁT TRÊN CƠ SỞ HẠ TẦNG MẠNG IPV6**</br>

| Tên thành viên   | MSSV       |
| ---------------- | ---------- |
| Hứa Hồ Gia Huy | 21522143 |
| NGUYỄN VĂN ĐẠT | 21521947 |


## **Đặt vấn đề**

Trong mô hình phát triển và vận hành phần mềm hiện đại, DevOps đóng vai trò then chốt trong việc tối ưu hóa quy trình triển khai, tự động hóa và giám sát hệ thống nhằm đảm bảo tính liên tục và ổn định của dịch vụ. Tuy nhiên, khi quy mô hệ thống ngày càng mở rộng với số lượng lớn máy chủ và dịch vụ, việc quản lý hiệu suất và phân tích sự cố trở nên phức tạp. Điều này càng trở nên thách thức hơn khi hệ thống hoạt động trên cơ sở hạ tầng mạng IPv6 – một xu hướng tất yếu trong tương lai nhằm mở rộng không gian địa chỉ và nâng cao hiệu quả kết nối. Việc giám sát đồng thời các dịch vụ và hạ tầng mạng sử dụng cả IPv4 và IPv6 đòi hỏi những công cụ chuyên biệt, có khả năng tích hợp sâu vào quy trình DevOps.  

## **Giải pháp triển khai**

Đề tài đề xuất triển khai một giải pháp giám sát hệ thống DevOps tích hợp trên hạ tầng mạng IPv6. Giải pháp sử dụng bộ công cụ ELK (Elasticsearch, Logstash, Kibana) để tập trung hóa việc thu thập, phân tích và trực quan hóa nhật ký từ các máy chủ và dịch vụ, giúp cải thiện khả năng truy vết và xử lý sự cố. Bên cạnh đó, Prometheus và Grafana sẽ được tích hợp để thu thập chỉ số hiệu suất của hệ thống theo thời gian thực, hỗ trợ giám sát sâu sát với các đặc điểm kỹ thuật của hạ tầng mạng IPv6. Việc áp dụng các công cụ này không chỉ đảm bảo tính hiệu quả trong giám sát, mà còn phù hợp với triết lý DevOps – tự động hóa, phản hồi nhanh và vận hành tối ưu.  

## **Các công nghệ sử dụng**
1. CI/CD: Github Actions
2. Công cụ triển khai hạ tầng: Terraform for GCP
3. Cloud: Google Cloud Platform
4. Application: MERN Stack
5. Web Server: Nginx
6. DNS Server: Bind9
7. Monitoring: Grafana Prometheus
8. Centralized Logging: ELK Stack
