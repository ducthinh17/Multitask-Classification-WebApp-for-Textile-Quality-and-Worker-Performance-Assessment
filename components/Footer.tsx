import React from "react";
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  Heading,
  IconButton,
  useColorModeValue,
  Image,
  Divider,
  HStack,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

// Giả sử logo vẫn giữ nguyên đường dẫn
const LOGO_PATH = "../../image/logo.png"; // Cập nhật nếu cần

const Footer = () => {
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("gray.700", "whiteAlpha.900");
  const linkColor = useColorModeValue("blue.600", "blue.300");
  const iconHoverBg = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const logoSize = "60px"; // Kích thước logo

  // Cập nhật tên công ty/dự án và năm
  const companyName = "Hệ Thống Đánh Giá Chất Lượng Đường May"; // HOẶC Tên Công Ty/Dự án của bạn
  const currentYear = new Date().getFullYear();

  const primaryLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/about", label: "Quy trình" },
    { href: "/", label: "Liên hệ" },
  ];

  const secondaryLinks = [
    { href: "/", label: "Điều khoản sử dụng" },
    { href: "/", label: "Chính sách bảo mật" },
  ];

  const socialLinks = [
    {
      href: "https://www.facebook.com/ducthinh.pld",
      label: "Facebook",
      icon: FaFacebook,
    },
    {
      href: "https://twitter.com/",
      label: "Twitter",
      icon: FaTwitter,
    },
    {
      href: "https://www.linkedin.com/in/pham-le-duc-thinh/",
      label: "LinkedIn",
      icon: FaLinkedin,
    },
  ];

  return (
    <Box bg={bgColor} color={textColor}>
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid
          templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr 2fr" }}
          spacing={8}
        >
          {/* Logo and Introduction */}
          <Stack spacing={6} align={{ base: "center", md: "flex-start" }}>
            <HStack align="center">
              <Image
                src={LOGO_PATH}
                alt={`${companyName} Logo`}
                boxSize={logoSize} // Đặt kích thước logo
                objectFit="contain"
              />
              <Heading
                as="h3"
                size="md"
                color={headingColor}
                display={{ base: "none", sm: "block" }}
              >
                {companyName}
              </Heading>
            </HStack>
            <Text
              fontSize={"sm"}
              textAlign={{ base: "center", md: "left" }}
              color={useColorModeValue("gray.600", "gray.300")}
            >
              Giải pháp ứng dụng thị giác máy tính tiên tiến trong đánh giá chất
              lượng ngành may mặc.
            </Text>
            <Text
              fontSize={"xs"}
              textAlign={{ base: "center", md: "left" }}
              color={useColorModeValue("gray.500", "gray.400")}
            >
              Thông tin nhóm phát triển: Trần Ngọc Phương Minh, Lê Thị Quỳnh
              Thơ, Phạm Lê Đức Thịnh.
            </Text>
          </Stack>

          {/* Primary Links */}
          <Stack align={{ base: "center", md: "flex-start" }}>
            <Heading size="sm" color={headingColor} mb={2}>
              Sản phẩm
            </Heading>
            {primaryLinks.map((link) => (
              <Link
                href={link.href}
                key={link.label}
                color={linkColor}
                _hover={{ textDecoration: "underline" }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>

          {/* Secondary Links */}
          <Stack align={{ base: "center", md: "flex-start" }}>
            <Heading size="sm" color={headingColor} mb={2}>
              Hỗ trợ
            </Heading>
            {secondaryLinks.map((link) => (
              <Link
                href={link.href}
                key={link.label}
                color={linkColor}
                _hover={{ textDecoration: "underline" }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>

          {/* Social Media Links */}
          <Stack align={{ base: "center", md: "flex-end" }}>
            <Heading size="sm" color={headingColor} mb={3}>
              Theo dõi chúng tôi
            </Heading>
            <HStack spacing={3}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  as="a"
                  href={social.href}
                  aria-label={social.label}
                  icon={<social.icon size="20px" />}
                  isRound
                  variant="ghost"
                  color={textColor}
                  _hover={{ bg: iconHoverBg, color: linkColor }}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ))}
            </HStack>
          </Stack>
        </SimpleGrid>

        {/* Divider */}
        <Divider
          my={8}
          borderColor={useColorModeValue("gray.300", "gray.700")}
        />

        {/* Footer Text */}
        <Text
          fontSize="sm"
          textAlign="center"
          color={useColorModeValue("gray.600", "gray.400")}
        >
          &copy; {currentYear} {companyName}. Bảo lưu mọi quyền.
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
