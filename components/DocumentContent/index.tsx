import React from "react";

export const DocumentContent: React.FC<{ source: string }> = ({ source }) => {
  return <iframe width="100%" height="100%" src={source} frameBorder="0" />;
};

// export const PolicyContent: React.FC = () => {
//   return (
//     <div>
//       <div
//         style={{
//           position: "absolute",
//           left: "50%",
//           marginLeft: "-306px",
//           top: "0px",
//           width: "612px",
//           height: "792px",
//           borderStyle: "outset",
//           overflow: "hidden",
//         }}
//       >
//         <div style={{ position: "absolute", left: "0px", top: "0px" }}>
//           {/* <img
//             src="84ee7724-6f16-11ec-a980-0cc47a792c0a_id_84ee7724-6f16-11ec-a980-0cc47a792c0a_files/background1.jpg"
//             width={612}
//             height={792}
//           /> */}
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "69.82px" }}
//           className="cls_002"
//         >
//           <span className="cls_002">
//             CHÍNH SÁCH BẢO MẬT VÀ CHIA SẺ THÔNG TIN
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "103.13px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">Sàn giao dịch thương mại điện tử </span>
//           <span className="cls_004">Vietsale.vn</span>
//           <span className="cls_003"> mong muốn đem lại một tiện ích</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "120.35px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             mua hàng trực tuyến tin cậy, tiết kiệm và thấu hiểu người dùng.
//             Chúng tôi nhận
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "137.57px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             thấy khách hàng sử dụng sàn giao dịch thương mại điện tử để mua sắm
//             nhưng
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "154.79px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             không phải ai cũng mong muốn chia sẻ thông tin cá nhân của mình.
//             Chúng tôi,
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "172.01px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">Công ty cổ phần </span>
//           <span className="cls_004">Vietsale.vn</span>
//           <span className="cls_003">
//             , tôn trọng quyền riêng tư của khách hàng và cam kết
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "189.23px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             bảo mật thông tin cá nhân của khách hàng khi khách hàng tin vào
//             chúng tôi cung
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "206.45px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             cấp thông tin cá nhân của khách hàng cho chúng tôi khi mua sắm tại
//             sàn giao dịch
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "223.67px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">thương mại điện tử </span>
//           <span className="cls_004">Vietsale.vn</span>
//           <span className="cls_003">
//             . Đây là nguyên tắc khi tiếp cận quyền riêng tư,
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "240.89px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             thông tin cá nhân tại sàn giao dịch thương mại điện tử{" "}
//           </span>
//           <span className="cls_004">Vietsale.vn</span>
//           <span className="cls_003">.</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "266.11px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Chính Sách Bảo Mật Thông Tin Cá Nhân Khách Hàng này bao gồm các nội
//             dung:
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "291.33px" }}
//           className="cls_004"
//         >
//           <span className="cls_004">
//             1. Mục đích và phạm vi thu thập thông tin
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "107.95px", top: "315.45px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Việc thu thập dữ liệu chủ yếu trên Sàn giao dịch TMĐT{" "}
//           </span>
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">bao</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "333.70px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             gồm: email, điện thoại, tên đăng nhập, mật khẩu đăng nhập, địa chỉ
//             khách hàng
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "351.95px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             (thành viên). Đây là các thông tin mà Sàn giao dịch TMĐT{" "}
//           </span>
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">cần thành</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "370.19px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             viên cung cấp bắt buộc khi đăng ký sử dụng dịch vụ và để{" "}
//           </span>
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">liên hệ xác</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "388.44px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             nhận khi khách hàng đăng ký sử dụng dịch vụ trên Sàn giao dịch{" "}
//           </span>
//           <span className="cls_005">Vietsale.vn</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "406.69px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             nhằm đảm bảo quyền lợi cho cho người tiêu dùng.
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "107.95px", top: "432.93px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Các thành viên sẽ tự chịu trách nhiệm về bảo mật và lưu giữ mọi hoạt
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "451.18px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             động sử dụng dịch vụ dưới tên đăng ký, mật khẩu và hộp thư điện tử
//             của mình.
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "469.43px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Ngoài ra, thành viên có trách nhiệm thông báo kịp thời cho Ban quản
//             lý Sàn giao
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "487.67px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">dịch </span>
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">
//             về những hành vi sử dụng trái phép, lạm dụng, vi phạm bảo mật,
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "505.92px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             lưu giữ tên đăng ký và mật khẩu của bên thứ ba để có biện pháp giải
//             quyết phù
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "524.17px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">hợp.</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "550.41px" }}
//           className="cls_004"
//         >
//           <span className="cls_004">2. Phạm vi sử dụng thông tin</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "88.13px", top: "576.66px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">Sàn giao dịch </span>
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">
//             sử dụng thông tin thành viên cung cấp cho các công
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "593.88px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">việc sau:</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "619.10px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             - Cung cấp các dịch vụ đến Thành viên;
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "644.32px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             - Gửi các thông báo về các hoạt động trao đổi thông tin giữa thành
//             viên và
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "661.54px" }}
//           className="cls_005"
//         >
//           <span className="cls_005">Vietsale.vn</span>
//           <span className="cls_003">;</span>
//         </div>
//       </div>
//       <div
//         style={{
//           position: "absolute",
//           left: "50%",
//           marginLeft: "-306px",
//           top: "802px",
//           width: "612px",
//           height: "792px",
//           borderStyle: "outset",
//           overflow: "hidden",
//         }}
//       >
//         <div style={{ position: "absolute", left: "0px", top: "0px" }}>
//           {/* <img
//             src="84ee7724-6f16-11ec-a980-0cc47a792c0a_id_84ee7724-6f16-11ec-a980-0cc47a792c0a_files/background2.jpg"
//             width={612}
//             height={792}
//           /> */}
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "70.38px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             - Ngăn ngừa các hoạt động phá hủy tài khoản người dùng của thành
//             viên hoặc các
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "87.60px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">hoạt động giả mạo Thành viên;</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "112.82px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             - Liên lạc và giải quyết với thành viên trong những trường hợp đặc
//             biệt;
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "138.04px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             - Không sử dụng thông tin cá nhân của thành viên ngoài mục đích xác
//             nhận và
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "155.26px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             liên hệ có liên quan đến giao dịch tại{" "}
//           </span>
//           <span className="cls_005">Vietsale.vn</span>
//           <span className="cls_003">;</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "180.47px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             - Trong trường hợp có yêu cầu của pháp luật: Ban quản lý Sàn giao
//             dịch
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "197.69px" }}
//           className="cls_005"
//         >
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">
//             có trách nhiệm hợp tác cung cấp thông tin cá nhân thành viên khi có
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "214.91px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             yêu cầu từ cơ quan tư pháp bao gồm: Viện kiểm sát, tòa án, cơ quan
//             công an điều
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "232.13px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             tra liên quan đến hành vi vi phạm pháp luật nào đó của khách hàng.
//             Ngoài ra,
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "249.35px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             không ai có quyền xâm phạm vào thông tin cá nhân của thành viên.
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "274.57px" }}
//           className="cls_004"
//         >
//           <span className="cls_004">3. Thời gian lưu trữ thông tin</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "298.70px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Dữ liệu cá nhân của Thành viên sẽ được lưu trữ cho đến khi có yêu
//             cầu hủy bỏ
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "314.83px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             hoặc tự thành viên đăng nhập và thực hiện hủy bỏ. Còn lại trong mọi
//             trường hợp
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "330.96px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             thông tin cá nhân thành viên sẽ được bảo mật trên máy chủ của{" "}
//           </span>
//           <span className="cls_005">Vietsale.vn</span>
//           <span className="cls_003">.</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "355.09px" }}
//           className="cls_004"
//         >
//           <span className="cls_004">
//             4. Những người hoặc tổ chức có thể được tiếp cận với thông tin cá
//             nhân:
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "379.21px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Đối tượng được tiếp cận với thông tin cá nhân của khách hàng/ thành
//             viên thuộc
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "395.34px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">một trong những trường hợp sau:</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "82.80px", top: "419.47px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             *Chi nhánh Phòng Thương mại và Công nghiệp Việt Nam tại Thanh Hóa
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "90.97px", top: "443.60px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             *Các đối tác có ký hợp động thực hiện 1 phần dịch vụ do Chi nhánh
//             Phòng
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "459.73px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Thương mại và Công nghiệp Việt Nam tại Thanh Hóa cung cấp. Các đối
//             tác này sẽ
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "475.86px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             nhận được những thông tin theo thỏa thuận hợp đồng (có thể 1 phần
//             hoặc toàn bộ
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "491.98px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             thông tin tùy theo điều khoản hợp đồng) để tiến hành hỗ trợ người
//             dùng sử dụng
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "508.11px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">dịch vụ do Công ty cung cấp.</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "86.96px", top: "532.24px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             *Cơ quan nhà nước khi có yêu cầu Công ty cung cấp thông tin người
//             dùng để
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "548.37px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">phục vụ quá trình điều tra.</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "91.04px", top: "572.50px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             *Người mua và người bán xảy ra tranh chấp và yêu cầu Công ty là đơn
//             vị hòa
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "588.63px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">giải.</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "612.76px" }}
//           className="cls_004"
//         >
//           <span className="cls_004">
//             5. Địa chỉ của đơn vị thu thập và quản lý thông tin cá nhân
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "636.88px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Mọi thông tin liên quan đến bảo mật thông tin của khách hàng đều
//             được chúng
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "653.01px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">tôi lưu trữ tại:</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "126.00px", top: "677.14px" }}
//           className="cls_004"
//         >
//           <span className="cls_004">Công ty Cổ phần Việt sale</span>
//         </div>
//       </div>
//       <div
//         style={{
//           position: "absolute",
//           left: "50%",
//           marginLeft: "-306px",
//           top: "1604px",
//           width: "612px",
//           height: "792px",
//           borderStyle: "outset",
//           overflow: "hidden",
//         }}
//       >
//         <div style={{ position: "absolute", left: "0px", top: "0px" }}>
//           {/* <img
//             src="84ee7724-6f16-11ec-a980-0cc47a792c0a_id_84ee7724-6f16-11ec-a980-0cc47a792c0a_files/background3.jpg"
//             width={612}
//             height={792}
//           /> */}
//         </div>
//         <div
//           style={{ position: "absolute", left: "108.00px", top: "70.38px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             - Trụ Sở : Tầng 2, Tòa nhà VCCI Thanh Hóa, 91 Nguyễn Chí Thanh,
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "126.00px", top: "87.60px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Phường Đông Thọ, Tp Thanh Hóa, Tỉnh Thanh Hóa, Việt Nam.
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "106.50px", top: "112.82px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">- Email: </span>
//           <a href="mailto:alovietsale@gmail.com">alovietsale@gmail.com</a>{" "}
//         </div>
//         <div
//           style={{ position: "absolute", left: "307.73px", top: "112.82px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">| Điện Thoại: 1900-8002</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "136.94px" }}
//           className="cls_004"
//         >
//           <span className="cls_004">
//             6. Phương tiện và công cụ để người dùng tiếp cận và chỉnh sửa dữ
//             liệu cá
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "153.07px" }}
//           className="cls_004"
//         >
//           <span className="cls_004">nhân của mình.</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "85.98px", top: "177.20px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Thành viên có quyền tự kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ
//             thông tin cá
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "193.33px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             nhân của mình bằng cách đăng nhập vào tài khoản và chỉnh sửa thông
//             tin cá
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "209.46px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">nhân hoặc yêu cầu </span>
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">thực hiện công việc này.</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "87.77px", top: "233.59px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Khi tiếp nhận những phản hồi này, Ban quản lý Sàn giao dịch{" "}
//           </span>
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">sẽ xác</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "249.71px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             nhận lại thông tin, phải có trách nhiệm trả lời lý do và hướng dẫn
//             thành viên
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "265.84px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             khôi phục hoặc xóa bỏ thông tin cá nhận khách hàng.
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "289.97px" }}
//           className="cls_004"
//         >
//           <span className="cls_004">
//             7. Cam kết bảo mật thông tin cá nhân khách hàng
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "314.10px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Thông tin cá nhân của thành viên trên{" "}
//           </span>
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">được </span>
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">cam kết bảo</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "330.23px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             mật tuyệt đối theo chính sách bảo vệ thông tin cá nhân của{" "}
//           </span>
//           <span className="cls_005">Vietsale.vn</span>
//           <span className="cls_003">. Việc thu</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "346.36px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             thập và sử dụng thông tin của mỗi thành viên chỉ được thực hiện khi
//             có sự đồng ý
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "362.48px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             của khách hàng đó trừ những trường hợp pháp luật có quy định khác.
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "386.61px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Không sử dụng, không chuyển giao, cung cấp hay tiết lộ cho bên thứ 3
//             nào không
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "402.74px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             liên quan đến hoạt động và vận hành sàn về thông tin cá nhân của
//             thành viên khi
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "418.87px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             không có sự cho phép đồng ý từ thành viên. Trong trường hợp chuyển
//             giao ứng
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "435.00px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">dụng, Ban quản lý sàn giao dịch </span>
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">sẽ thông báo đến các thành viên.</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "459.13px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Trong trường hợp máy chủ lưu trữ thông tin bị hacker tấn công dẫn
//             đến mất mát
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "475.26px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">dữ liệu cá nhân thành viên, </span>
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">
//             sẽ có trách nhiệm thông báo vụ việc cho cơ
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "491.38px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             quan chức năng điều tra xử lý kịp thời và thông báo cho thành viên
//             được biết.
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "515.51px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Bảo mật tuyệt đối mọi thông tin giao dịch trực tuyến của Thành viên
//             bao gồm
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "531.64px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             thông tin hóa đơn kế toán chứng từ số hóa tại khu vực dữ liệu trung
//             tâm an toàn
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "547.77px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">cấp 1 của </span>
//           <span className="cls_005">Vietsale.vn</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "571.90px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Ban quản lý sàn giao dịch Vietsale.vnyêu cầu các cá nhân khi đăng
//             ký/mua
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "588.03px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             hàng là thành viên, phải cung cấp đầy đủ thông tin cá nhân có liên
//             quan như: Họ
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "604.15px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             và tên, địa chỉ liên lạc, email, số chứng minh nhân dân, điện thoại,
//             số tài khoản,
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "620.28px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             số thẻ thanh toán …., và chịu trách nhiệm về tính pháp lý của những
//             thông tin
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "636.41px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">trên. Ban quản lý </span>
//           <span className="cls_005">Vietsale.vn </span>
//           <span className="cls_003">
//             không chịu trách nhiệm cũng như không giải quyết
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "652.54px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             mọi khiếu nại có liên quan đến quyền lợi của Thành viên đó nếu xét
//             thấy tất cả
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "668.67px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             thông tin cá nhân của thành viên đó cung cấp khi đăng ký ban đầu là
//             không chính
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "684.80px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">xác.</span>
//         </div>
//       </div>
//       <div
//         style={{
//           position: "absolute",
//           left: "50%",
//           marginLeft: "-306px",
//           top: "2406px",
//           width: "612px",
//           height: "792px",
//           borderStyle: "outset",
//           overflow: "hidden",
//         }}
//       >
//         <div style={{ position: "absolute", left: "0px", top: "0px" }}>
//           {/* <img
//             src="84ee7724-6f16-11ec-a980-0cc47a792c0a_id_84ee7724-6f16-11ec-a980-0cc47a792c0a_files/background4.jpg"
//             width={612}
//             height={792}
//           /> */}
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "70.38px" }}
//           className="cls_004"
//         >
//           <span className="cls_004">
//             8. Cơ chế tiếp nhận và giải quyết khiếu nại liên quan đến thông tin
//             cá nhân
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "86.51px" }}
//           className="cls_004"
//         >
//           <span className="cls_004">của khách hàng</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "108.00px", top: "138.40px" }}
//           className="cls_007"
//         >
//           <span className="cls_007">
//             Thành viên có quyền gửi khiếu nại về việc lộ thông tin các nhân cho
//             bên thứ 3 đến
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "108.00px", top: "161.03px" }}
//           className="cls_007"
//         >
//           <span className="cls_007">Ban quản trị của </span>
//           <span className="cls_004">Vietsale.vn</span>
//           <span className="cls_003"> </span>
//           <span className="cls_007">đến địa chỉ sau:</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "126.00px", top: "208.08px" }}
//           className="cls_004"
//         >
//           <span className="cls_004">Công ty Cổ phần Việt sale</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "108.00px", top: "234.39px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             - Thành lập và hoạt động theo Giấy chứng nhận đăng ký doanh nghiệp
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "108.00px", top: "259.61px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             số: 2802993437 do Sở Kế hoạch và Đầu tư thành phố Thanh Hóa cấp,
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "108.00px", top: "284.83px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">đăng ký lần đầu ngày 06/12/2021.</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "108.00px", top: "310.05px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             - Trụ Sở : Tầng 2, Tòa nhà VCCI Thanh Hóa, 91 Nguyễn Chí Thanh,
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "126.00px", top: "327.27px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Phường Đông Thọ, Tp Thanh Hóa, Tỉnh Thanh Hóa, Việt Nam.
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "108.00px", top: "352.49px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             - Người đại điện pháp luật: Trần thị Ngọc
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "108.00px", top: "377.71px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">- Email: </span>
//           <a href="mailto:alovietsale@gmail.com">alovietsale@gmail.com</a>{" "}
//           <span className="cls_003"> Hotline: 1900-8002</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "72.00px", top: "402.93px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">
//             Thời gian xứ lý phản ánh liên quan đến thông tin cá nhân khách hàng
//             là 15 ngày.
//           </span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "236.13px", top: "453.37px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">ĐẠI DIỆN CÔNG TY CỔ PHẦN VIỆT SALE</span>
//         </div>
//         <div
//           style={{ position: "absolute", left: "311.00px", top: "480.42px" }}
//           className="cls_003"
//         >
//           <span className="cls_003">[Đã ký và đóng dấu]</span>
//         </div>
//       </div>
//     </div>
//   );
// };
