/**
docker image build -t khanh2nq/img-be_api_fiverr:latest .
docker build -t img-be_api_fiverr .
   - build ra image

docker image list
   - xem danh sách các image

docker container list
docker container ls   
docker ps 
   - list ra tất cả các container đang được chạy
   - thêm tag -a (all) list ra tất cả các container bất kể đang chạy hay không chạy

docker image remove ten_id_image
   - xoá image

dive: là thư viện giúp phân tích image

docker run --env-file .env --name con-be_api_fiverr -p 3070:3069 -d img-be_api_fiverr
MYSQL: docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag


docker logs 644
   - xem log terminal của container

docker container remove id_ten_container
   - xoá container

docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' id_name_container
   - lấy địa chỉ IP: để 2 container giao tiếp với nhau

docker compose up -d
   - chạy docker compose

docker compose down 
   - xoá docker compose (2 service)

docker login

docker push vulebaolong/img-be_cyber_community:latest
   - lưu ý phải đày đủ các cấu hình
   - tên tài khoản docker: vulebaolong
   - tên image: img-be_cyber_community
   - tag version: latest

# x86 (chip intel): amd64
#     - docker build --platform=linux/amd64
#     - docker build --platform=linux/x86_64
# arm (chip apple): arm64
#     - docker build --platform=linux/arm64

ls -la
   - show tất cả các folder đang có

cd duong_dan_ten_folder
   - truy cập cập vào folder

chạy kết nối giữa github và server
sudo ./svc.sh install
sudo ./svc.sh start

touch docker-compose.yml
   - tạo file

sudo su
   - kẹp quyền sudo để tránh mỗi làn gõ lệnh docker phải kèm sudo
exit
   - thoát chế độ sudo su


dấu port với Nginx

sudo apt update
sudo apt install nginx

sudo nano /etc/nginx/sites-available/default
   - mở file cấu hình

xoá nhanh code trong nginnx
ctrl + K
   - xoá theo dòng

code code từ file nginx_hidden_port vào
save: ctrl + O

sudo nginx -t
   - kiểm tra cấu hình

sudo systemctl restart nginx
   - chạy lại nginnx


 */
