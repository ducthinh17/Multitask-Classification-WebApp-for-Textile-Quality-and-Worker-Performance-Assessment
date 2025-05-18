import React from "react";
import {
  Box,
  Container,
  Heading,
  Button,
  Link,
  Stack,
  Text,
  VStack,
  HStack,
  Image,
  Divider,
  useTheme, // To access theme colors/spacing if needed for custom components
  Kbd,
  Flex,
  useBreakpointValue, // For a distinct visual style for section numbers
} from "@chakra-ui/react";

// Assuming NavBar and Footer are Chakra-compatible or styled independently
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const QuyTrinhDanhGiaPage: React.FC = () => {
  const theme = useTheme(); // Access Chakra theme

  // Helper component for section headers for consistency
  const SectionHeader: React.FC<{ number: string; title: string }> = ({
    number,
    title,
  }) => (
    <HStack alignItems="center" spacing={4} mb={5}>
      <Kbd
        fontSize={{ base: "xl", md: "2xl" }}
        px={3}
        py={1.5}
        bg="blue.500"
        color="white"
        borderRadius="md"
      >
        {number}
      </Kbd>
      <Heading as="h2" size="lg" color="gray.700">
        {title}
      </Heading>
    </HStack>
  );
  // Responsive button direction
  const buttonStackDirection = useBreakpointValue<"row" | "column">({
    base: "column",
    md: "row",
  });
  const heroTextAlign = useBreakpointValue<"center" | "left">({
    base: "center",
    md: "left",
  });
  const heroImageShow = useBreakpointValue({ base: false, lg: true });

  return (
    <Box>
      <NavBar />
      <Container maxW="container.lg" py={{ base: 6, md: 10 }}>
        {/* Header Section */}
        <Flex
          as="section"
          id="hero"
          align="center"
          justify={{ base: "center", lg: "space-between" }}
          direction={{ base: "column-reverse", lg: "row" }} // Image on right on large screens
          bgGradient="linear(to-br, blue.600, purple.600)"
          color="white"
          minH={{ base: "calc(100vh - 70px)", md: "550px" }} // 70px là chiều cao giả định của header
          px={{ base: 6, md: 16, lg: 24 }}
          py={{ base: 12, md: 20 }}
        >
          <VStack
            alignItems={heroTextAlign}
            spacing={{ base: 5, md: 6 }}
            maxW={{ base: "full", lg: "50%" }}
            textAlign={heroTextAlign}
          >
            <Heading
              as="h1"
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="bold"
              lineHeight="tight"
              color="whiteAlpha.900"
            >
              QUY TRÌNH ĐÁNH GIÁ{" "}
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              color="whiteAlpha.800"
              maxW="xl" // Giới hạn chiều rộng của đoạn text này
            >
              Chất lượng đường may là một trong những yếu tố quan trọng quyết
              định đến bậc thợ, với hiệu suất làm việc của công nhân. Thế nên
              việc ứng dụng thị giác máy tính trong đánh giá ngoại quan đường
              may sẽ cung cấp kết quả khách quan dành cho doanh nghiệp để có thể
              tối ưu quy trình và phân loại bậc thợ phù hợp
            </Text>
            <Stack
              direction={buttonStackDirection}
              spacing={4}
              mt={{ base: 6, md: 8 }}
              w={{ base: "full", md: "auto" }}
            >
              <Button
                as={Link}
                href="/upload"
                size="lg"
                colorScheme="yellow"
                color="gray.800"
                px={10}
                _hover={{ bg: "yellow.400" }}
                w={{ base: "full", md: "auto" }}
                boxShadow="md"
              >
                Kiểm tra chất lượng
              </Button>
              <Button
                as={Link}
                href="#quy-trinh"
                size="lg"
                variant="outline"
                borderColor="yellow.400"
                color="yellow.400"
                px={10}
                _hover={{
                  bg: "whiteAlpha.200",
                  borderColor: "yellow.300",
                  color: "yellow.300",
                }}
                w={{ base: "full", md: "auto" }}
                boxShadow="md"
              >
                Quy trình đánh Giá
              </Button>
            </Stack>
          </VStack>
          {heroImageShow && (
            <Flex
              flex="1"
              justify="center"
              align="center"
              display={{ base: "none", lg: "flex" }} // Chỉ hiển thị trên màn hình lớn
              ml={10} // Margin left cho hình ảnh
            >
              <Image
                src="../../image/checked.png"
                alt="Minh họa công nghệ đánh giá đường may"
                borderRadius="lg"
                boxShadow="2xl"
                objectFit="cover"
              />
            </Flex>
          )}
        </Flex>
        {/* KẾT THÚC PHẦN HERO SECTION ĐƯỢC THIẾT KẾ LẠI */}

        <Divider mb={{ base: 8, md: 12 }} />

        {/* Main Content Sections */}
        <VStack spacing={{ base: 10, md: 16 }} align="stretch">
          {/* Section 01: Sewing according to provided shapes */}
          <Box as="section" id="quy-trinh">
            <SectionHeader number="01" title="May theo hình dạng cung cấp" />
            <VStack spacing={5} align="stretch">
              <Text fontSize={{ base: "md", md: "lg" }} color="gray.700">
                Để đạt được khả năng thực hiện chính xác đường may trên nhiều vị
                trí của sản phẩm, công nhân đầu vào cần phải may được các kiểu
                đường may có cơ sở từ mũi 301. Các kiểu đường may được chia
                thành 2 nhóm: đường thẳng và đường cong.
              </Text>
              <Box
                display="flex"
                justifyContent="center"
                p={4}
                bg="gray.50"
                borderRadius="md"
              >
                <Image
                  src="/image/types.png" // As in your code, assumed from PDF pg 1, geometric shapes
                  alt="Các kiểu đường may cơ bản"
                  borderRadius="md"
                  objectFit="contain" // Use 'contain' if you want to see the whole image without cropping
                  maxH="300px" // Constrain height for very tall images
                  boxShadow="sm"
                  // Responsive width example:
                  // w={{ base: "100%", sm: "80%", md: "60%" }}
                />
              </Box>
            </VStack>
          </Box>

          {/* Section 02: Level classification through computer vision */}
          <Box as="section">
            <SectionHeader
              number="02"
              title="Phân loại cấp độ thông qua thị giác máy tính"
            />
            <VStack spacing={5} align="stretch">
              <Text fontSize={{ base: "md", md: "lg" }} color="gray.700">
                Hệ thống thị giác máy tính hoạt động dựa trên các thuật toán học
                sâu (Deep Learning) và mạng nơ-ron nhân tạo (Artificial Neural
                Networks). Quá trình xử lý hình ảnh trong thị giác máy tính bao
                gồm các bước chính sau:
              </Text>
              <Box
                display="flex"
                justifyContent="center"
                p={{ base: 2, md: 4 }}
                bg="gray.50"
                borderRadius="md"
              >
                <Image
                  src="/image/folow.png" // This should be the diagram from PDF page 2
                  alt="Quy trình xử lý hình ảnh bằng thị giác máy tính"
                  borderRadius="md"
                  objectFit="contain"
                  maxH="400px" // Adjust as needed for diagram clarity
                  boxShadow="sm"
                  // w={{ base: "100%", md: "80%" }}
                />
              </Box>
              <Text fontSize="sm" color="gray.500" textAlign="center"></Text>
            </VStack>
          </Box>

          {/* Section 03: Determining worker skill level */}
          <Box as="section">
            <SectionHeader number="03" title="Xác định bậc thợ" />
            <Box
              display="flex"
              justifyContent="center"
              p={{ base: 2, md: 4 }}
              bg="gray.50"
              borderRadius="md"
            >
              <Image
                src="/image/evaluate.png" // This should be the diagram from PDF page 2
                alt="Quy trình xử lý hình ảnh bằng thị giác máy tính"
                borderRadius="md"
                objectFit="contain"
                maxH="400px" // Adjust as needed for diagram clarity
                boxShadow="sm"
                // w={{ base: "100%", md: "80%" }}
              />
            </Box>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.700">
              Để đảm bảo mỗi công nhân phát huy tối đa khả năng và đóng góp hiệu
              quả vào quy trình sản xuất, việc xác định bậc thợ dựa trên đánh
              giá khách quan là cần thiết. Thông qua quy trình may mẫu và đánh
              giá bằng thị giác máy tính, doanh nghiệp có thể phân loại chính
              xác trình độ tay nghề của từng công nhân, từ đó có kế hoạch đào
              tạo và bố trí công việc phù hợp, tối ưu hóa hiệu suất chung.
            </Text>
            {/* No distinct image for section 03 was shown in the PDF, so omitting it for better logic */}
          </Box>

          <Divider my={{ base: 6, md: 8 }} />
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
};

export default QuyTrinhDanhGiaPage;
