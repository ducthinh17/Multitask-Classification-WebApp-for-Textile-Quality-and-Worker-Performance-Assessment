import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Container,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  Button,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  SimpleGrid,
  Divider,
  Badge,
  IconButton,
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
} from "@chakra-ui/react";
import {
  FiDatabase,
  FiEye,
  FiAlertCircle,
  // FiCheckCircle, // Not used directly in this version
  FiPieChart,
  FiUser,
  FiList,
  // FiStar, // Not used directly in this version
  FiHash, // Added for Worker ID
  FiBriefcase, // Added for Department
} from "react-icons/fi";
import { Timestamp as FirebaseTimestamp } from "firebase/firestore"; // Import with alias

// Firebase imports
import { db } from "../firebase/firebaseConfig"; // Adjust path if your firebase.ts is elsewhere
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import NavBar from "../components/NavBar"; // Assuming NavBar is in components folder
import Footer from "../components/Footer"; // Assuming Footer is in components folder

// --- START: Interfaces (Reused and adjusted from Upload.tsx) ---
interface WorkerInfo {
  name: string;
  workerId: string;
  department: string;
}

interface SavedImagePredictionDetails {
  label: string;
  confidence: string;
}

interface SavedImagePrediction {
  filename: string;
  category: SavedImagePredictionDetails;
  sub_category: SavedImagePredictionDetails;
  level: SavedImagePredictionDetails;
  orientation: SavedImagePredictionDetails;
}

interface AssessmentRecord {
  id: string; // Firestore document ID
  workerInfo: WorkerInfo;
  averageLevel: number;
  skillRankLabel: string;
  skillRankValue: number;
  processedImages: SavedImagePrediction[];
  savedAt: FirebaseTimestamp; // Using aliased FirebaseTimestamp
  sessionId?: string;
}
// --- END: Interfaces ---

// --- START: Helper Component HeaderWithLines (Similar to Upload.tsx) ---
const HeaderWithLines: React.FC<{
  title: string;
  icon?: React.ElementType;
}> = ({ title, icon: TitleIcon }) => (
  <Flex alignItems="center" my={{ base: 6, md: 10 }} w="full">
    <Divider flex="1" borderColor={useColorModeValue("gray.300", "gray.600")} />
    <Flex alignItems="center" mx={{ base: 3, md: 6 }}>
      {TitleIcon && (
        <Icon
          as={TitleIcon}
          mr={3}
          w={{ base: 6, md: 8 }}
          h={{ base: 6, md: 8 }}
          color={useColorModeValue("purple.500", "purple.300")}
        />
      )}
      <Heading
        as="h2"
        size={{ base: "lg", md: "xl" }}
        textAlign="center"
        color={useColorModeValue("purple.600", "purple.300")}
        whiteSpace={{ base: "normal", md: "nowrap" }}
      >
        {title}
      </Heading>
    </Flex>
    <Divider flex="1" borderColor={useColorModeValue("gray.300", "gray.600")} />
  </Flex>
);
// --- END: Helper Component HeaderWithLines ---

// --- START: Helper function to format Timestamp ---
const formatDate = (timestamp: FirebaseTimestamp | undefined): string => {
  if (!timestamp || typeof timestamp.toDate !== "function") {
    return "Không có ngày";
  }
  try {
    return timestamp.toDate().toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Ngày không hợp lệ";
  }
};
// --- END: Helper function to format Timestamp ---

const DatabasePage: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentRecord | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("gray.700", "gray.200");
  const cardBg = useColorModeValue("white", "gray.750");
  const tableStripeColor = useColorModeValue("gray.50", "gray.800");
  const headingColor = useColorModeValue("purple.600", "purple.300");
  const subtleTextColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    const fetchAssessments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const assessmentsCollection = collection(db, "skillAssessments");
        const q = query(assessmentsCollection, orderBy("savedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedAssessments: AssessmentRecord[] = [];
        querySnapshot.forEach((doc) => {
          fetchedAssessments.push({
            id: doc.id,
            ...(doc.data() as Omit<AssessmentRecord, "id">),
          });
        });
        setAssessments(fetchedAssessments);
      } catch (err: any) {
        console.error("Error fetching assessments:", err);
        setError(
          err.message || "Không thể tải dữ liệu đánh giá. Vui lòng thử lại sau."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const handleViewDetails = (assessment: AssessmentRecord) => {
    setSelectedAssessment(assessment);
    onOpen();
  };

  const DetailModal: React.FC = () => {
    if (!selectedAssessment) return null;

    const {
      workerInfo,
      averageLevel,
      skillRankLabel,
      skillRankValue,
      processedImages,
      savedAt,
    } = selectedAssessment;

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader color={headingColor} borderBottomWidth="1px">
            <Flex align="center">
              <Icon as={FiList} mr={3} />
              Chi tiết Đánh giá Tay nghề
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={6} align="stretch">
              {/* --- START: UPDATED WORKER INFO SECTION --- */}
              <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <Heading
                  size="md"
                  mb={5} // Increased margin bottom for heading
                  color={headingColor}
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FiUser} mr={2} /> Thông tin Công nhân
                </Heading>
                <SimpleGrid
                  columns={{ base: 1, md: 3 }}
                  spacing={{ base: 4, md: 6 }}
                >
                  <Stat>
                    <StatLabel
                      display="flex"
                      alignItems="center"
                      fontSize="sm"
                      color={subtleTextColor}
                      mb={1}
                    >
                      <Icon as={FiUser} mr={2} w={4} h={4} />
                      Tên Công nhân
                    </StatLabel>
                    <StatNumber
                      fontSize="md"
                      fontWeight="medium"
                      color={textColor}
                    >
                      {workerInfo.name || "N/A"}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel
                      display="flex"
                      alignItems="center"
                      fontSize="sm"
                      color={subtleTextColor}
                      mb={1}
                    >
                      <Icon as={FiHash} mr={2} w={4} h={4} />
                      Mã số
                    </StatLabel>
                    <StatNumber
                      fontSize="md"
                      fontWeight="medium"
                      color={textColor}
                    >
                      {workerInfo.workerId || "N/A"}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel
                      display="flex"
                      alignItems="center"
                      fontSize="sm"
                      color={subtleTextColor}
                      mb={1}
                    >
                      <Icon as={FiBriefcase} mr={2} w={4} h={4} />
                      Bộ phận
                    </StatLabel>
                    <StatNumber
                      fontSize="md"
                      fontWeight="medium"
                      color={textColor}
                    >
                      {workerInfo.department || "N/A"}
                    </StatNumber>
                  </Stat>
                </SimpleGrid>
              </Box>
              {/* --- END: UPDATED WORKER INFO SECTION --- */}

              <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                <Heading
                  size="md"
                  mb={4}
                  color={headingColor}
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FiPieChart} mr={2} /> Kết quả Tổng hợp
                </Heading>
                <StatGroup
                  borderWidth="1px"
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                  borderRadius="md"
                  p={4}
                >
                  <Stat>
                    <StatLabel color={subtleTextColor}>
                      Điểm Cấp độ TB
                    </StatLabel>
                    <StatNumber color={textColor}>
                      {averageLevel.toFixed(2)}
                    </StatNumber>
                    <StatHelpText color={subtleTextColor}>
                      Trên {processedImages.length} ảnh
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel color={subtleTextColor}>Bậc thợ (1-5)</StatLabel>
                    <StatNumber color={headingColor}>
                      {skillRankValue}
                    </StatNumber>
                    <StatHelpText fontWeight="medium" color={subtleTextColor}>
                      {skillRankLabel}
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel color={subtleTextColor}>Ngày đánh giá</StatLabel>
                    <StatNumber
                      fontSize="md"
                      fontWeight="normal"
                      color={textColor}
                    >
                      {formatDate(savedAt)}
                    </StatNumber>
                  </Stat>
                </StatGroup>
              </Box>

              <Box>
                <Heading
                  size="md"
                  mb={4}
                  color={headingColor}
                  display="flex"
                  alignItems="center"
                >
                  <Icon as={FiEye} mr={2} /> Chi tiết Ảnh đã Xử lý (
                  {processedImages.length})
                </Heading>
                {processedImages.length > 0 ? (
                  <TableContainer
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                  >
                    <Table variant="simple" size="sm">
                      <Thead bg={useColorModeValue("gray.100", "gray.700")}>
                        <Tr>
                          <Th color={subtleTextColor}>Ảnh</Th>
                          <Th color={subtleTextColor}>Loại chính</Th>
                          <Th color={subtleTextColor}>Loại phụ</Th>
                          <Th color={subtleTextColor}>Cấp độ</Th>
                          <Th color={subtleTextColor}>Độ tin cậy (CĐ)</Th>
                          <Th color={subtleTextColor}>Hướng/Mặt</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {processedImages.map((img, idx) => (
                          <Tr key={idx} _hover={{ bg: tableStripeColor }}>
                            <Td
                              maxW="150px"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              title={img.filename}
                              color={textColor}
                            >
                              {img.filename}
                            </Td>
                            <Td color={textColor}>{img.category.label}</Td>
                            <Td color={textColor}>{img.sub_category.label}</Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  parseInt(
                                    img.level.label.replace("Level ", "") || "0"
                                  ) >= 4
                                    ? "green"
                                    : parseInt(
                                        img.level.label.replace("Level ", "") ||
                                          "0"
                                      ) >= 2
                                    ? "yellow"
                                    : "red"
                                }
                                variant="subtle"
                                px={2}
                                py={0.5}
                                borderRadius="md"
                              >
                                {img.level.label}
                              </Badge>
                            </Td>
                            <Td color={textColor}>{img.level.confidence}</Td>
                            <Td color={textColor}>{img.orientation.label}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Text fontStyle="italic" color="gray.500">
                    Không có dữ liệu ảnh chi tiết cho đánh giá này.
                  </Text>
                )}
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter borderTopWidth="1px">
            <Button colorScheme="purple" onClick={onClose}>
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const tableColumns = useMemo(
    () => [
      {
        header: "STT",
        accessor: (_row: AssessmentRecord, index: number) => index + 1,
      },
      {
        header: "Tên Công nhân",
        accessor: (row: AssessmentRecord) => row.workerInfo.name,
      },
      {
        header: "Mã số",
        accessor: (row: AssessmentRecord) => row.workerInfo.workerId,
      },
      {
        header: "Bộ phận",
        accessor: (row: AssessmentRecord) => row.workerInfo.department,
      },
      {
        header: "Điểm TB",
        accessor: (row: AssessmentRecord) => (
          <Text fontWeight="medium" color="green">{row.averageLevel.toFixed(2)}</Text>
        ),
      },
      {
        header: "Bậc thợ",
        accessor: (row: AssessmentRecord) => (
          <Badge
            colorScheme={
              row.skillRankValue >= 4
                ? "green"
                : row.skillRankValue >= 3
                ? "yellow"
                : row.skillRankValue >= 2
                ? "orange"
                : "red"
            }
            variant="solid"
            px={3}
            py={1}
            borderRadius="md"
            fontSize="sm" // Adjusted for consistency
          >
            {row.skillRankValue} - {row.skillRankLabel}
          </Badge>
        ),
      },
      {
        header: "Số ảnh",
        accessor: (row: AssessmentRecord) => row.processedImages.length,
      },
      {
        header: "Ngày lưu",
        accessor: (row: AssessmentRecord) => formatDate(row.savedAt),
      },
      {
        header: "Hành động",
        accessor: (row: AssessmentRecord) => (
          <Tooltip
            label="Xem chi tiết đánh giá"
            placement="top"
            openDelay={300}
          >
            <IconButton
              icon={<FiEye />}
              colorScheme="purple"
              variant="outline"
              aria-label="Xem chi tiết"
              size="sm"
              onClick={() => handleViewDetails(row)}
            />
          </Tooltip>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // Removed handleViewDetails from deps as its definition is stable
  );

  return (
    <>
      <NavBar />
      <Box as="main" minH="calc(100vh - 120px)">
        <Container
          maxW="container.xl"
          py={{ base: 6, md: 10 }}
          px={{ base: 4, md: 6 }}
        >
          <HeaderWithLines
            title="Cơ sở Dữ liệu Đánh giá Tay nghề"
            icon={FiDatabase}
          />

          {isLoading && (
            <Flex justify="center" align="center" h="300px">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="purple.500"
                size="xl"
              />
              <Text ml={4} fontSize="lg" color={textColor}>
                Đang tải dữ liệu...
              </Text>
            </Flex>
          )}

          {error && (
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="md"
              p={6}
              minH="200px"
            >
              <AlertIcon as={FiAlertCircle} boxSize="40px" mr={0} />
              <Heading size="md" mt={4} mb={2}>
                Đã xảy ra lỗi
              </Heading>
              <Text>{error}</Text>
            </Alert>
          )}

          {!isLoading && !error && assessments.length === 0 && (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="300px"
              borderWidth="2px"
              borderStyle="dashed"
              borderColor={useColorModeValue("gray.300", "gray.600")}
              borderRadius="md"
              bg={useColorModeValue("gray.50", "gray.750")}
              p={8}
            >
              <Icon as={FiDatabase} boxSize="50px" color="gray.400" mb={4} />
              <Heading size="md" color={textColor} mb={2}>
                Không có dữ liệu
              </Heading>
              <Text color={useColorModeValue("gray.600", "gray.400")}>
                Hiện tại chưa có bản ghi đánh giá nào được lưu trữ.
              </Text>
            </Flex>
          )}

          {!isLoading && !error && assessments.length > 0 && (
            <Box
              bg={cardBg}
              p={{ base: 4, md: 6 }}
              shadow="xl"
              borderWidth="1px"
              borderRadius="lg"
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg" color={headingColor}>
                  Danh sách Kết quả Đánh giá
                </Heading>
                <Badge colorScheme="purple" p={2} borderRadius="md">
                  Tổng số: {assessments.length} bản ghi
                </Badge>
              </Flex>
              <TableContainer>
                <Table variant="striped" colorScheme="gray" size="md">
                  <Thead bg={useColorModeValue("purple.50", "purple.900")}>
                    <Tr>
                      {tableColumns.map((col) => (
                        <Th key={col.header} color={headingColor} py={4}>
                          {col.header}
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {assessments.map((assessment, index) => (
                      <Tr
                        key={assessment.id}
                        _hover={{
                          bg: useColorModeValue("purple.50", "purple.800"),
                        }}
                      >
                        {tableColumns.map((col) => (
                          <Td key={col.header} py={3} color={textColor}>
                            {/* @ts-ignore */}
                            {typeof col.accessor === "function"
                              ? col.accessor(assessment, index)
                              : assessment[col.accessor]}
                          </Td>
                        ))}
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
      <DetailModal />
    </>
  );
};

export default DatabasePage;
