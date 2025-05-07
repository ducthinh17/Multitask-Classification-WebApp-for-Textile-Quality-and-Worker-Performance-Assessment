import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Link,
  Image,
  Card,
  CardHeader,
  CardBody,
  List,
  ListItem,
  VStack,
  HStack,
  Divider,
  Tag,
  Avatar,
  Icon, // Để sử dụng Icon
  Stack, // Sử dụng Stack cho layout button trên mobile
  useBreakpointValue, // Để điều chỉnh responsive
} from "@chakra-ui/react";

// Nếu bạn muốn sử dụng icons, hãy cài đặt react-icons: npm install react-icons
// Ví dụ:
// import { FaInfoCircle, FaBullseye, FaRulerHorizontal, FaShieldAlt, FaUsers, FaCamera, FaBrain, FaChartLine } from 'react-icons/fa';

const HomePageFinalUpdate: React.FC = () => {
  const teamMembers = [
    {
      name: "Trần Ngọc Phương Minh",
      role: "Thành viên",
      avatarUrl: "https://via.placeholder.com/150/007BFF/FFFFFF?Text=Minh",
    },
    {
      name: "Lê Thị Quỳnh Thơ",
      role: "Thành viên",
      avatarUrl: "https://via.placeholder.com/150/28A745/FFFFFF?Text=Tho",
    },
    {
      name: "Phạm Lê Đức Thịnh",
      role: "Thành viên",
      avatarUrl: "https://via.placeholder.com/150/FFC107/000000?Text=Thinh",
    },
  ];

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
      {/* PHẦN HERO SECTION ĐƯỢC THIẾT KẾ LẠI HOÀN TOÀN */}
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
            fontSize={{ base: "xl", sm: "xl", md: "xl", lg: "3xl" }}
            fontWeight="bold"
            lineHeight="tight"
            color="whiteAlpha.900"
          >
            ĐÁNH GIÁ NGOẠI QUAN ĐƯỜNG MAY THÔNG QUA THỊ GIÁC MÁY TÍNH
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg", lg: "xl" }}
            color="whiteAlpha.800"
            maxW="xl" // Giới hạn chiều rộng của đoạn text này
          >
            Ngành may mặc là một trong những ngành mũi nhọn tại Việt Nam, đóng
            góp đáng kể vào GDP và kim ngạch xuất khẩu. Tuy nhiên, chất lượng
            nguồn lao động, đặc biệt là trong khâu đào tạo và đánh giá tay nghề
            công nhân, vẫn còn nhiều bất cập.
          </Text>
          <Stack
            direction={buttonStackDirection}
            spacing={4}
            mt={{ base: 6, md: 8 }}
            w={{ base: "full", md: "auto" }}
          >
            <Button
              as={Link}
              href="#gioi-thieu-de-tai"
              size="lg"
              colorScheme="yellow"
              color="gray.800"
              px={10}
              _hover={{ bg: "yellow.400" }}
              w={{ base: "full", md: "auto" }}
              boxShadow="md"
            >
              Giới thiệu đề tài
            </Button>
            <Button
              as={Link}
              href="/about"
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
              Quy Trình
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
              src="../../image/Textile123.png"
              alt="Minh họa công nghệ đánh giá đường may"
              borderRadius="lg"
              boxShadow="2xl"
              objectFit="cover"
            />
          </Flex>
        )}
      </Flex>
      {/* KẾT THÚC PHẦN HERO SECTION ĐƯỢC THIẾT KẾ LẠI */}

      {/* GIỚI THIỆU ĐỀ TÀI (Nội dung chi tiết hơn sau banner) */}
      <Box as="section" id="gioi-thieu-de-tai" px={{ base: 6, md: 16 }} py={16}>
        <Heading as="h2" size="xl" mb={8} textAlign="center" color="blue.700">
          Giới thiệu đề tài
        </Heading>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="tall"
          mb={6}
          color="gray.700"
        >
          Hiện nay, phần lớn các doanh nghiệp dệt may vẫn dựa vào kinh nghiệm cá
          nhân của người hướng dẫn để đánh giá tay nghề đầu vào của công nhân,
          mang tính chủ quan và thiếu hệ thống. Việc kiểm tra chủ yếu dựa trên
          quan sát cảm quan, dễ dẫn đến sai lệch trong việc xác định đúng năng
          lực công nhân, từ đó ảnh hưởng đến công tác phân công nhân sự và hiệu
          quả sản xuất. Điều này cho thấy nhu cầu cấp thiết trong việc ứng dụng
          công nghệ vào quy trình đánh giá tay nghề để nâng cao tính chính xác,
          tiết kiệm chi phí và thời gian đào tạo, đồng thời góp phần nâng cao
          năng suất và năng lực cạnh tranh của doanh nghiệp.
        </Text>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="tall"
          color="gray.700"
        >
          Hướng tới mục tiêu xây dựng một hệ thống đánh giá tay nghề may khách
          quan và hiệu quả, đề tài đề xuất ứng dụng thị giác máy tính để phân
          tích ngoại quan đường may. Hệ thống sẽ đánh giá mức độ chính xác, độ
          đều mũi chỉ và phát hiện các lỗi thường gặp trên sản phẩm. Thông qua
          đó, doanh nghiệp có thể xác định công nhân mới có đủ điều kiện tham
          gia sản xuất hay không, đồng thời đề xuất nội dung đào tạo bổ sung nếu
          cần. Việc chuyển từ phương pháp đánh giá cảm quan sang hệ thống dựa
          trên dữ liệu giúp tăng độ tin cậy trong phân loại bậc thợ, nâng cao
          chất lượng nhân lực và tối ưu hóa quy trình sản xuất.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mt={12}>
          <Image
            src="../../image/Textile2.png"
            alt="Thị giác máy tính"
            borderRadius="lg"
            boxShadow="lg"
            objectFit="cover"
            width="100%"
            height={{ base: "200px", md: "300px" }} // Set fixed height for uniformity
          />
          <Image
            src="../../image/Textile4.png"
            alt="Dây chuyền may mặc"
            borderRadius="lg"
            boxShadow="lg"
            objectFit="cover"
            width="100%"
            height={{ base: "200px", md: "300px" }} // Set fixed height for uniformity
          />
          <Image
            src="../../image/Textile5.png"
            alt="Quy trình đào tạo"
            borderRadius="lg"
            boxShadow="lg"
            objectFit="cover"
            width="100%"
            height={{ base: "200px", md: "300px" }} // Set fixed height for uniformity
          />
        </SimpleGrid>
      </Box>

      {/* MỤC TIÊU ĐỀ TÀI */}
      <Box
        as="section"
        id="muc-tieu-de-tai"
        bg="gray.100"
        py={16}
        px={{ base: 6, md: 16 }}
      >
        <Box textAlign="center" mb={12}>
          <Heading as="h2" size="xl" color="blue.700">
            Mục tiêu đề tài
          </Heading>
          <Text fontSize="lg" color="gray.600" mt={3} maxW="3xl" mx="auto">
            Mục tiêu chính của đề tài là xây dựng hệ thống đánh giá chất lượng
            đường may một cách khách quan thông qua thị giác máy tính, từ đó
            phân loại bậc thợ và đề xuất lộ trình đào tạo phù hợp.
          </Text>
        </Box>

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="center"
          align={{ base: "stretch", md: "flex-start" }}
          gap={8}
        >
          <Card
            flex="1"
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            textAlign="center"
            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
            transition="all 0.2s ease-out"
          >
            <Tag
              size="lg"
              variant="solid"
              colorScheme="teal"
              mb={5}
              borderRadius="full"
              px={5}
              py={2}
              fontSize="xl"
            >
              01
            </Tag>
            <Heading as="h3" size="lg" mb={4} color="teal.700">
              Kiểm tra chất lượng
            </Heading>
            <Image
              src="../../image/cv.png"
              alt="Thị giác máy tính"
              borderRadius="lg"
              boxShadow="lg"
            />
            <br />
            <Text fontSize="md" color="gray.700">
              Xây dựng hệ thống sử dụng thiết bị quét đường may để kiểm tra chất
              lượng may.
            </Text>
          </Card>
          <Card
            flex="1"
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            textAlign="center"
            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
            transition="all 0.2s ease-out"
          >
            <Tag
              size="lg"
              variant="solid"
              colorScheme="cyan"
              mb={5}
              borderRadius="full"
              px={5}
              py={2}
              fontSize="xl"
            >
              02
            </Tag>
            <Heading as="h3" size="lg" mb={4} color="cyan.700">
              Phân tích & Phân loại
            </Heading>
            <Image
              src="../../image/Textile1.avif"
              alt="Thị giác máy tính"
              borderRadius="lg"
              boxShadow="lg"
            />
            <br />
            <Text fontSize="md" color="gray.700">
              Phân tích và phân loại tay nghề công nhân dựa trên dữ liệu số.
            </Text>
          </Card>
          <Card
            flex="1"
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            textAlign="center"
            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
            transition="all 0.2s ease-out"
          >
            <Tag
              size="lg"
              variant="solid"
              colorScheme="purple"
              mb={5}
              borderRadius="full"
              px={5}
              py={2}
              fontSize="xl"
            >
              03
            </Tag>
            <Heading as="h3" size="lg" mb={4} color="purple.700">
              Cải thiện tay nghề
            </Heading>
            <Image
              src="../../image/training.png"
              alt="Thị giác máy tính"
              borderRadius="lg"
              boxShadow="lg"
            />
            <br />
            <Text fontSize="md" color="gray.700">
              Đưa ra giải pháp cải thiện tay nghề thông qua hệ thống quét thay
              cho phương pháp đánh giá cảm quan có phần rủi ro.
            </Text>
          </Card>
        </Flex>
      </Box>

      {/* ĐƯỜNG MAY PHỔ BIẾN */}
      <Box
        as="section"
        id="duong-may-pho-bien"
        py={16}
        px={{ base: 6, md: 16 }}
      >
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={12}
          color="blue.700"
          borderBottomWidth="3px"
          borderColor="blue.200"
          pb={4}
        >
          ĐƯỜNG MAY PHỔ BIẾN TRONG MAY MẶC
        </Heading>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          gap={{ base: 8, lg: 12 }}
        >
          <Box flex={{ lg: "1.2" }}>
            {" "}
            {/* Tăng tỷ lệ cho text */}
            <Text
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="tall"
              mb={5}
              color="gray.700"
            >
              Trong số các loại đường may sử dụng trong sản xuất, đường may từ
              mũi may thắt nút{" "}
              <Text as="strong" color="blue.600">
                301
              </Text>{" "}
              là một trong những đường may được sử dụng rộng rãi nhất trên nhiều
              sản phẩm như áo sơ mi, quần tây, váy, đồng phục và các mặt hàng
              thời trang khác.
            </Text>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="tall"
              mb={5}
              color="gray.700"
            >
              Với độ bền cao, tính thẩm mỹ tốt và khả năng thích ứng với nhiều
              loại vải, đây là đường may cơ bản được ứng dụng phổ biến trong hầu
              hết các chuyền may công nghiệp.
            </Text>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="tall"
              color="gray.700"
            >
              Do đó, loại đường may này không chỉ phù hợp với phạm vi nghiên cứu
              và đánh giá chất lượng của đề tài, mà còn là cơ sở lý tưởng để
              triển khai kế hoạch đào tạo dành cho công nhân.
            </Text>
          </Box>
          <Box flex="1" textAlign="center" w="full">
            <Image
              src="../../image/301_sew.png"
              alt="Minh họa đường may 301"
              borderRadius="lg"
              boxShadow="xl"
              mb={6}
            />
            <HStack
              justifyContent="space-around"
              spacing={{ base: 2, md: 4 }}
              mt={4}
              p={{ base: 3, md: 5 }}
              borderWidth="1px"
              borderRadius="lg"
              borderColor="gray.300"
              bg="white"
            >
              <Box textAlign="center">
                <Text
                  fontWeight="bold"
                  color="gray.800"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Nhìn phía trên
                </Text>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                  Đường may 1 kim thắt nút.
                </Text>
              </Box>
              <Divider
                orientation="vertical"
                height={{ base: "40px", md: "60px" }}
                borderColor="gray.300"
              />
              <Box textAlign="center">
                <Text
                  fontWeight="bold"
                  color="gray.800"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Nhìn phía dưới
                </Text>
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                  Suốt chỉ nằm ở dưới.
                </Text>
              </Box>
              <Divider
                orientation="vertical"
                height={{ base: "40px", md: "60px" }}
                borderColor="gray.300"
              />
              <Box textAlign="center">
                <Text
                  fontWeight="bold"
                  color="gray.800"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  CODE
                </Text>
                <Tag colorScheme="blue" size={{ base: "md", md: "lg" }}>
                  301
                </Tag>
              </Box>
            </HStack>
          </Box>
        </Flex>
      </Box>

      {/* ĐÁNH GIÁ CHẤT LƯỢNG ĐƯỜNG MAY */}
      <Box
        as="section"
        id="danh-gia-chat-luong"
        bg="gray.100"
        py={16}
        px={{ base: 6, md: 16 }}
      >
        <Heading as="h2" size="xl" textAlign="center" mb={4} color="blue.700">
          ĐÁNH GIÁ CHẤT LƯỢNG ĐƯỜNG MAY
        </Heading>
        <Text
          textAlign="center"
          fontSize={{ base: "md", md: "lg" }}
          color="gray.600"
          mb={12}
          maxW="4xl"
          mx="auto"
        >
          Trong nghiên cứu của Germanova-Krasteva & Petrov (Bulgaria) về kiểm
          tra chất lượng đường may khi may vải nhẹ, nhóm tác giả đã chỉ ra rằng
          chất lượng đường may có thể được đánh giá dựa trên ba nhóm tiêu chí
          chính: đặc tính thẩm mỹ, đặc tính cơ lý (cơ học) và đặc tính bền vững.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 10 }}>
          {/* Thẩm mỹ */}
          <Card
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            boxShadow="lg"
            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
            transition="all 0.25s ease-in-out"
            bg="white"
          >
            <CardHeader bg="teal.500" color="white" borderTopRadius="xl" py={5}>
              <Heading size="lg" textAlign="center" color="whiteAlpha.900">
                Đặc tính thẩm mỹ
              </Heading>
            </CardHeader>
            <CardBody p={8}>
              <List spacing={4} fontSize="md" color="pink.700">
                <ListItem color="teal.700">
                  • Độ đồng đều của đường may
                </ListItem>
                <ListItem color="teal.700">
                  • Độ đồng đều của mật độ mũi may
                </ListItem>
                <ListItem color="teal.700">
                  • Độ thẳng của đường may trên bề mặt vải
                </ListItem>
                <ListItem color="teal.700">
                  • Tính sắc nét và gọn gàng tại điểm giao
                </ListItem>
                <ListItem color="teal.700">
                  • Màu sắc chỉ may đồng đều, hợp với vải
                </ListItem>
              </List>
            </CardBody>
          </Card>

          {/* Cơ học */}
          <Card
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            boxShadow="lg"
            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
            transition="all 0.25s ease-in-out"
            bg="white"
          >
            <CardHeader bg="cyan.600" color="white" borderTopRadius="xl" py={5}>
              <Heading size="lg" textAlign="center" color="whiteAlpha.900">
                Đặc tính cơ học
              </Heading>
            </CardHeader>
            <CardBody p={8}>
              <List spacing={4} fontSize="md" color="blue.700">
                <ListItem color="blue.700">• Độ bền theo phương ngang</ListItem>
                <ListItem color="blue.700">• Độ giãn của đường may</ListItem>
                <ListItem color="blue.700">
                  • Độ cứng uốn của đường may
                </ListItem>
                <ListItem color="blue.700">
                  • Khả năng chịu lực kéo giật
                </ListItem>
                <ListItem color="blue.700">
                  • Khả năng giữ form sau khi giặt
                </ListItem>
              </List>
            </CardBody>
          </Card>

          {/* Bền vững */}
          <Card
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            boxShadow="lg"
            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
            transition="all 0.25s ease-in-out"
            bg="white"
          >
            <CardHeader
              bg="purple.600"
              color="white"
              borderTopRadius="xl"
              py={5}
            >
              <Heading size="lg" textAlign="center" color="whiteAlpha.900">
                Đặc tính bền vững
              </Heading>
            </CardHeader>
            <CardBody p={8}>
              <List spacing={4} fontSize="md" color="purple.700">
                <ListItem color="purple.700">• Khả năng chống ma sát</ListItem>
                <ListItem color="purple.700">• Khả năng chịu giặt</ListItem>
                <ListItem color="purple.700">• Khả năng chịu giặt khô</ListItem>
                <ListItem color="purple.700">
                  • Khả năng chống nhăn sau sử dụng
                </ListItem>
                <ListItem color="purple.700">
                  • Độ ổn định của chỉ may dưới ánh sáng
                </ListItem>
              </List>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      {/* THÔNG TIN THÀNH VIÊN */}
      <Box as="section" id="thanh-vien" py={16} px={{ base: 6, md: 16 }}>
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={12}
          color="blue.700"
          borderBottomWidth="3px"
          borderColor="blue.200"
          pb={4}
        >
          Thành viên thực hiện
        </Heading>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-around"
          align="stretch" // Đảm bảo các Card kéo dãn chiều cao đều nhau
          gap={{ base: 8, md: 6 }}
          flexWrap="wrap" // Hỗ trợ wrap nếu nhiều phần tử
        >
          {teamMembers.map((member) => (
            <Card
              key={member.name}
              flex="1 1 300px" // Đảm bảo co giãn hợp lý
              maxW={{ base: "100%", md: "400px" }}
              minH="100px" // Chiều cao tối thiểu để các Card đều nhau
              p={6}
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              _hover={{
                boxShadow: "2xl",
                transform: "translateY(-4px)",
              }}
              transition="all 0.2s ease-in-out"
              textAlign="center"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Avatar
                size="2xl"
                name={member.name}
                src={member.avatarUrl}
                mb={5}
                borderWidth="3px"
                borderColor="blue.400"
              />
              <Heading size="lg" color="gray.800" mb={1}>
                {member.name}
              </Heading>
              {/* Bạn có thể thêm vai trò của thành viên ở đây nếu muốn */}
              {/* <Text color="gray.500" fontSize="md">{member.role}</Text> */}
            </Card>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default HomePageFinalUpdate;
