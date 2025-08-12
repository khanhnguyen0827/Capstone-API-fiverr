import { ApiProperty } from '@nestjs/swagger';

export class ThongTinNguoiDung {
  @ApiProperty({ description: 'ID người dùng', example: 1, type: Number })
  id: number;

  @ApiProperty({ description: 'Họ và tên', example: 'Nguyễn Văn A' })
  name: string;

  @ApiProperty({ description: 'Email đăng nhập', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Số điện thoại', example: '0123456789', required: false })
  phone?: string;

  @ApiProperty({ description: 'Ngày sinh (YYYY-MM-DD)', example: '1990-01-01', required: false })
  birth_day?: string;

  @ApiProperty({ description: 'Giới tính', example: 'Nam', required: false, enum: ['Nam', 'Nữ', 'Khác'] })
  gender?: string;

  @ApiProperty({ description: 'Vai trò', example: 'freelancer', enum: ['user', 'freelancer', 'client', 'admin'] })
  role: string;

  @ApiProperty({ description: 'Kỹ năng chuyên môn', example: 'React, Node.js', required: false })
  skill?: string;

  @ApiProperty({ description: 'Chứng chỉ', example: 'AWS Certified Developer', required: false })
  certification?: string;
}

export class DangNhapView {
  @ApiProperty({ description: 'Email đăng nhập', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'Mật khẩu', example: 'password123' })
  pass_word: string;
}

export class BinhLuanViewModel {
  @ApiProperty({ description: 'ID bình luận', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID công việc', example: 10 })
  ma_cong_viec: number;

  @ApiProperty({ description: 'ID người bình luận', example: 5 })
  ma_nguoi_binh_luan: number;

  @ApiProperty({ description: 'Ngày bình luận (ISO)', example: '2024-01-20T10:30:00.000Z' })
  ngay_binh_luan: string;

  @ApiProperty({ description: 'Nội dung bình luận', example: 'Dự án rất tốt!' })
  noi_dung: string;

  @ApiProperty({ description: 'Số sao đánh giá (0-5)', example: 5 })
  sao_binh_luan: number;
}

export class ChiTietLoaiView {
  @ApiProperty({ description: 'ID chi tiết loại', example: 3 })
  id: number;

  @ApiProperty({ description: 'Tên chi tiết', example: 'Lập trình web' })
  ten_chi_tiet: string;

  @ApiProperty({ description: 'Hình ảnh', example: 'https://example.com/web.jpg', required: false })
  hinh_anh?: string;
}

export class ChiTietLoaiCongViecViewModel extends ChiTietLoaiView {
  @ApiProperty({ description: 'ID loại công việc', example: 1, required: false })
  ma_loai_cong_viec?: number;
}

export class CongViecViewModel {
  @ApiProperty({ description: 'ID công việc', example: 1001 })
  id: number;

  @ApiProperty({ description: 'Tên công việc', example: 'Thiết kế website responsive' })
  ten_cong_viec: string;

  @ApiProperty({ description: 'Điểm đánh giá trung bình', example: 5, required: false })
  danh_gia?: number;

  @ApiProperty({ description: 'Giá tiền (VNĐ)', example: 2000000 })
  gia_tien: number;

  @ApiProperty({ description: 'Hình ảnh', example: 'https://example.com/cover.jpg', required: false })
  hinh_anh?: string;

  @ApiProperty({ description: 'Mô tả', example: 'Thiết kế website chuyên nghiệp', required: false })
  mo_ta?: string;

  @ApiProperty({ description: 'Mô tả ngắn', example: 'Website bán hàng', required: false })
  mo_ta_ngan?: string;

  @ApiProperty({ description: 'Số sao công việc', example: 4, required: false })
  sao_cong_viec?: number;

  @ApiProperty({ description: 'ID chi tiết loại', example: 4, required: false })
  ma_chi_tiet_loai?: number;

  @ApiProperty({ description: 'ID người tạo', example: 1, required: false })
  nguoi_tao?: number;
}

export class LoaiCongViecViewModel {
  @ApiProperty({ description: 'ID loại công việc', example: 1 })
  id: number;

  @ApiProperty({ description: 'Tên loại công việc', example: 'Công nghệ thông tin' })
  ten_loai_cong_viec: string;
}

export class CapNhatNguoiDung {
  @ApiProperty({ description: 'Họ và tên', example: 'Nguyễn Văn A', required: false })
  name?: string;

  @ApiProperty({ description: 'Số điện thoại', example: '0123456789', required: false })
  phone?: string;

  @ApiProperty({ description: 'Ngày sinh', example: '1990-01-01', required: false })
  birth_day?: string;

  @ApiProperty({ description: 'Giới tính', example: 'Nam', required: false, enum: ['Nam', 'Nữ', 'Khác'] })
  gender?: string;

  @ApiProperty({ description: 'Vai trò', example: 'freelancer', required: false, enum: ['user', 'freelancer', 'client', 'admin'] })
  role?: string;

  @ApiProperty({ description: 'Kỹ năng', example: 'React, Node.js', required: false })
  skill?: string;

  @ApiProperty({ description: 'Chứng chỉ', example: 'AWS Certified Developer', required: false })
  certification?: string;

  @ApiProperty({ description: 'Mật khẩu mới', example: 'newpassword123', required: false, minLength: 6 })
  pass_word?: string;
}

export class ThueCongViecViewModel {
  @ApiProperty({ description: 'ID thuê công việc', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID công việc', example: 1001 })
  ma_cong_viec?: number;

  @ApiProperty({ description: 'ID người thuê', example: 2 })
  ma_nguoi_thue?: number;

  @ApiProperty({ description: 'Ngày thuê (ISO)', example: '2024-05-01T12:00:00.000Z' })
  ngay_thue: string;

  @ApiProperty({ description: 'Trạng thái hoàn thành', example: false })
  hoan_thanh?: boolean;
}


