# Test API Lấy Danh Sách Người Dùng

## Endpoint
```
GET /auth/list
```

## Query Parameters

### 1. Pagination cơ bản
```
GET /auth/list?page=1&pageSize=5
```

### 2. Với filters
```
GET /auth/list?page=1&pageSize=10&filters={"name":"John","role":"user"}
```

### 3. Filter theo email
```
GET /auth/list?filters={"email":"@gmail.com"}
```

### 4. Filter theo role
```
GET /auth/list?filters={"role":"admin"}
```

### 5. Filter theo gender
```
GET /auth/list?filters={"gender":"male"}
```

## Response Format
```json
{
  "page": 1,
  "pageSize": 10,
  "totalItem": 25,
  "totalPage": 3,
  "items": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "123456789",
      "birth_day": "1990-01-01",
      "gender": "male",
      "role": "user",
      "skill": "Web Development",
      "certification": "AWS Certified"
    }
  ]
}
```

## Tính năng

1. **Pagination**: Hỗ trợ phân trang với `page` và `pageSize`
2. **Filtering**: Lọc theo các trường: name, email, role, gender
3. **Search**: Tìm kiếm text với `contains` (không phân biệt hoa thường)
4. **Sorting**: Sắp xếp theo ID giảm dần (mới nhất trước)
5. **Select Fields**: Chỉ trả về các trường cần thiết, không bao gồm password

## Lưu ý

- `page` mặc định là 1
- `pageSize` mặc định là 10, tối đa 100
- `filters` phải là JSON string hợp lệ
- Nếu filter không hợp lệ, sẽ bỏ qua và trả về tất cả người dùng
- API trả về tổng số item và tổng số trang để frontend có thể hiển thị pagination
