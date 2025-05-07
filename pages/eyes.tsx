import React, { Suspense } from "react";
import Model from "../components/Model_eyes"; // Your existing model component
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import HealthTips from "../components/HealthTips"; // Kept as in your original structure
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Container,
  VStack,
  List,
  ListItem,
  ListIcon,
  Image,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons"; // Using CheckCircleIcon for lists

// A helper component for section headers with lines
const HeaderWithLines: React.FC<{ title: string }> = ({ title }) => (
  <Flex alignItems="center" my={{ base: 6, md: 10 }} w="full">
    <Divider flex="1" borderColor={useColorModeValue("gray.300", "gray.600")} />
    <Heading
      as="h2"
      size={{ base: "lg", md: "xl" }}
      mx={{ base: 3, md: 6 }}
      textAlign="center"
      color={useColorModeValue("teal.600", "teal.300")}
      whiteSpace={{ base: "normal", md: "nowrap" }} // Prevent awkward wrapping on mobile for short titles
    >
      {title}
    </Heading>
    <Divider flex="1" borderColor={useColorModeValue("gray.300", "gray.600")} />
  </Flex>
);

const Eyes: React.FC = () => {
  // Define colors for consistency
  const sectionBg = useColorModeValue("gray.50", "gray.800"); // Background for step cards
  const headingColor = useColorModeValue("gray.700", "whiteAlpha.900"); // Primary heading color for content within cards
  const accentHeadingColor = useColorModeValue("teal.600", "teal.300"); // Accent color for main page title & section titles
  const textColor = useColorModeValue("gray.600", "gray.300"); // General text color

  return (
    <>
      <NavBar />
      <Box as="main">
        <Container
          maxW="container.xl"
          py={{ base: 6, md: 10 }}
          px={{ base: 4, md: 6 }}
        >
          {/* Section 1: Main Title and Introduction */}
          <VStack
            spacing={{ base: 3, md: 4 }}
            textAlign="center"
            mb={{ base: 8, md: 12 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }} // Responsive font size
              color={accentHeadingColor}
              lineHeight="1.2"
            >
              ĐÁNH GIÁ THÔNG QUA THỊ GIÁC MÁY TÍNH
            </Heading>
            <Image
              src="../../image/pie.png"
              alt="Minh họa công nghệ đánh giá đường may"
              borderRadius="lg"
              w="45%"
            />
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={textColor}
              maxW={{ base: "full", md: "3xl" }}
              mx="auto"
            >
              Thị giác máy tính (Computer Vision – CV) là một lĩnh vực quan
              trọng của trí tuệ nhân tạo (Artificial Intelligence – AI), cho
              phép máy tính phân tích, hiểu và phản hồi dữ liệu hình ảnh hoặc
              video một cách tự động. Công nghệ này giúp cải thiện khả năng kiểm
              tra chất lượng sản phẩm, phát hiện lỗi sản xuất và tối ưu hóa quy
              trình trong ngành may mặc.
            </Text>
          </VStack>

          {/* Section 2: Image Upload */}
          <VStack
            spacing={{ base: 4, md: 6 }}
            alignItems="stretch"
            mb={{ base: 8, md: 12 }}
          >
            <HeaderWithLines title="Đăng tải hình ảnh tại đây" />
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={textColor}
              textAlign="center"
              fontWeight="500"
            >
              Yêu cầu đối với hình ảnh tải lên:
            </Text>
            <List
              spacing={3}
              alignSelf="center"
              maxW={{ base: "full", md: "lg" }}
              color="black" // Đặt màu mặc định cho toàn bộ danh sách
              fontSize={{ base: "sm", md: "md" }}
            >
              <ListItem display="flex" alignItems="center">
                <Text color="black"> ✅ Hình ảnh rõ nét, đầy đủ ánh sáng.</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <Text color="black">
                  ✅ Góc chụp vuông góc với bề mặt vải, không nghiêng lệch.
                </Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <Text color="black">
                  ✅ Khoảng cách hợp lý để toàn bộ đường may nằm trong khung
                  ảnh, nhưng vẫn thấy rõ chi tiết mũi chỉ.
                </Text>
              </ListItem>
            </List>

            <Box
              my={{ base: 4, md: 6 }}
              p={{ base: 3, md: 5 }}
              border="2px dashed"
              borderColor={useColorModeValue("gray.400", "gray.500")}
              borderRadius="lg" // "10px" is similar to "lg" in Chakra
              mx="auto"
              w={{ base: "full", sm: "md", md: "lg" }} // Responsive width
              display="flex"
              justifyContent="center"
            >
              <Suspense
                fallback={
                  <Text textAlign="center" color={textColor}>
                    Đang tải model...
                  </Text>
                }
              >
                <Model />
              </Suspense>
            </Box>
          </VStack>

          {/* Section 3: Assessment Results */}
          <VStack
            spacing={{ base: 4, md: 6 }}
            alignItems="stretch"
            mb={{ base: 8, md: 12 }}
          >
            <HeaderWithLines title="Kết quả đánh giá" />
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={textColor}
              textAlign="center"
            >
              Kết quả và nhận xét đánh giá sau khi xử lý hình ảnh thông qua thị
              giác máy tính sẽ được hiển thị tại đây.
            </Text>

            <Box
              p={{ base: 4, md: 6 }}
              borderWidth="1px"
              borderRadius="md"
              textAlign="center"
              minH="120px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={useColorModeValue("white", "gray.750")} // Slightly different background for this box
              borderColor={useColorModeValue("gray.200", "gray.600")}
            >
              <Text
                fontStyle="italic"
                color={useColorModeValue("gray.500", "gray.400")}
              >
                Hiện tại chưa có dữ liệu đánh giá nào. Vui lòng tải ảnh lên để
                bắt đầu.
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>

      <HealthTips />
      <Footer />
    </>
  );
};

export default Eyes;
