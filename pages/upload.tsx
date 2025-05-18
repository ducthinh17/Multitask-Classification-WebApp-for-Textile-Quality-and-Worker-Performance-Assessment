import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Image,
  Divider,
  useColorModeValue,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  // AlertTitle, // No longer used directly
  // AlertDescription, // No longer used directly
  useToast,
  Input,
  // AspectRatio, // No longer used directly
  Center,
  Icon,
  // Tag, // No longer used directly
  Progress,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Wrap,
  WrapItem,
  CloseButton,
  StatGroup,
  Tooltip,
  FormControl,
  FormLabel,
  // Stack, // No longer used directly
} from "@chakra-ui/react";
import {
  FiFile,
  FiUploadCloud,
  FiAlertCircle,
  FiTrash2,
  FiEye,
  FiBarChart2,
  FiAward,
  FiUser,
  FiEdit2,
  FiCheckSquare,
  FiSave, // Added for Save button
} from "react-icons/fi";
import {
  CheckCircleIcon,
  WarningIcon,
  InfoIcon,
  ViewIcon,
  NotAllowedIcon,
  TimeIcon,
  QuestionOutlineIcon,
} from "@chakra-ui/icons";

// Firebase imports
import { db } from "../firebase/firebaseConfig"; // Adjust path if your firebase.ts is elsewhere
import { collection, addDoc, Timestamp } from "firebase/firestore";

import { PREDICT_API_URL } from "../config";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
// import HealthTips from "../components/HealthTips";

// --- START: Định nghĩa Interfaces (No changes here from previous version) ---
interface PredictionDetail {
  label: string;
  confidence: string;
}
interface PredictionsData {
  category: PredictionDetail;
  sub_category: PredictionDetail;
  level: PredictionDetail;
  orientation: PredictionDetail;
}
interface PredictionResponseFromApi {
  filename: string;
  predictions: PredictionsData;
  error: string | null;
}
interface PredictionResponseForDisplay {
  filename: string;
  predictions: PredictionsData;
}

type PredictionStatus = "chờ xử lý" | "đang tải" | "thành công" | "thất bại";

interface UploadedImageFile {
  id: string;
  file: File;
  previewUrl: string;
  status: PredictionStatus;
  prediction?: PredictionResponseForDisplay | null;
  error?: string | null;
  previewFailed: boolean;
}

interface WorkerInfo {
  name: string;
  workerId: string;
  department: string;
}
// --- END: Định nghĩa Interfaces ---

// --- START: Firebase Data Structure Interfaces ---
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
  workerInfo: WorkerInfo;
  averageLevel: number;
  skillRankLabel: string;
  skillRankValue: number;
  processedImages: SavedImagePrediction[];
  savedAt: Timestamp;
  sessionId?: string; // Optional: if you want to group multiple saves in a session
}
// --- END: Firebase Data Structure Interfaces ---

// --- START: Component ResultCard (No changes here from previous version) ---
interface ResultCardProps {
  title: string;
  label: string;
  confidence: string;
  icon: React.ElementType;
}
const ResultCard: React.FC<ResultCardProps> = ({
  title,
  label,
  confidence,
  icon,
}) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const titleColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const confidenceValue = parseFloat(confidence.replace("%", ""));
  let confidenceColorScheme = "gray";
  if (confidenceValue >= 90) confidenceColorScheme = "green";
  else if (confidenceValue >= 70) confidenceColorScheme = "yellow";
  else if (confidenceValue >= 40) confidenceColorScheme = "orange";
  else confidenceColorScheme = "red";
  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={cardBg}
      _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
    >
      <VStack align="start" spacing={3}>
        <Flex align="center">
          <Icon as={icon} mr={2} color={titleColor} w={5} h={5} />
          <Heading size="sm" color={titleColor}>
            {title}
          </Heading>
        </Flex>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          {label}
        </Text>
        <VStack align="start" w="full">
          <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
            Độ tin cậy:
          </Text>
          <Progress
            value={confidenceValue}
            size="sm"
            colorScheme={confidenceColorScheme}
            w="full"
            borderRadius="md"
          />
          <Text
            fontSize="sm"
            fontWeight="medium"
            color={`${confidenceColorScheme}.500`}
          >
            {confidence}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};
// --- END: Component ResultCard ---

// --- START: Component PredictionResults (No changes here from previous version) ---
interface PredictionResultsProps {
  data: PredictionResponseForDisplay | null | undefined;
}
const PredictionResults: React.FC<PredictionResultsProps> = ({ data }) => {
  if (
    !data ||
    typeof data.filename === "undefined" ||
    typeof data.predictions === "undefined"
  ) {
    console.warn(
      "[PredictionResults component] Dữ liệu không hợp lệ hoặc thiếu, không render chi tiết:",
      data
    );
    return (
      <Box mt={8} p={5} borderWidth="1px" borderRadius="md" textAlign="center">
        <Text fontStyle="italic" color="orange.400">
          Dữ liệu kết quả không đầy đủ hoặc đang chờ xử lý.
        </Text>
      </Box>
    );
  }
  const { predictions } = data;
  return (
    <VStack spacing={6} align="stretch" w="full" mt={4}>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
        <ResultCard
          title="Loại đường may (Chính)"
          label={predictions.category.label}
          confidence={predictions.category.confidence}
          icon={CheckCircleIcon}
        />
        <ResultCard
          title="Loại đường may (Phụ)"
          label={predictions.sub_category.label}
          confidence={predictions.sub_category.confidence}
          icon={CheckCircleIcon}
        />
        <ResultCard
          title="Cấp độ chất lượng"
          label={predictions.level.label}
          confidence={predictions.level.confidence}
          icon={ViewIcon}
        />
        <ResultCard
          title="Hướng/Mặt vải"
          label={predictions.orientation.label}
          confidence={predictions.orientation.confidence}
          icon={InfoIcon}
        />
      </SimpleGrid>
      {predictions.level.label === "Level 4" &&
        parseFloat(predictions.level.confidence.replace("%", "")) < 50 && (
          <Box
            mt={4}
            p={4}
            bg={useColorModeValue("orange.50", "orange.800")}
            borderColor={useColorModeValue("orange.300", "orange.600")}
            borderWidth="1px"
            borderRadius="md"
            display="flex"
            alignItems="center"
          >
            <Icon
              as={WarningIcon}
              color={useColorModeValue("orange.500", "orange.300")}
              w={5}
              h={5}
              mr={3}
            />
            <Text
              color={useColorModeValue("orange.700", "orange.200")}
              fontSize="sm"
            >
              <strong>Lưu ý cho {predictions.level.label}:</strong> Độ tin cậy (
              {predictions.level.confidence}) cho cấp độ này tương đối thấp. Cân
              nhắc kiểm tra thủ công.
            </Text>
          </Box>
        )}
    </VStack>
  );
};
// --- END: Component PredictionResults ---

// --- START: Component HeaderWithLines (No changes here from previous version) ---
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
          w={{ base: 5, md: 6 }}
          h={{ base: 5, md: 6 }}
          color={useColorModeValue("teal.600", "teal.300")}
        />
      )}
      <Heading
        as="h2"
        size={{ base: "lg", md: "xl" }}
        textAlign="center"
        color={useColorModeValue("teal.600", "teal.300")}
        whiteSpace={{ base: "normal", md: "nowrap" }}
      >
        {title}
      </Heading>
    </Flex>
    <Divider flex="1" borderColor={useColorModeValue("gray.300", "gray.600")} />
  </Flex>
);
// --- END: Component HeaderWithLines ---

// --- START: COMPONENT UploadedImageItem (No changes here from previous version) ---
interface UploadedImageItemProps {
  imageFile: UploadedImageFile;
  onRemove: (id: string) => void;
  onViewResult: (prediction: PredictionResponseForDisplay) => void;
}
const UploadedImageItem: React.FC<UploadedImageItemProps> = ({
  imageFile,
  onRemove,
  onViewResult,
}) => {
  const { id, file, previewUrl, status, prediction, error, previewFailed } =
    imageFile;
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const errorColor = useColorModeValue("red.500", "red.300");
  const successColor = useColorModeValue("green.500", "green.300");

  const getStatusIcon = () => {
    if (status === "đang tải") return <Spinner size="xs" color="teal.500" />;
    if (status === "thành công")
      return <Icon as={CheckCircleIcon} color={successColor} />;
    if (status === "thất bại")
      return <Icon as={NotAllowedIcon} color={errorColor} />;
    if (status === "chờ xử lý") return <Icon as={TimeIcon} color="gray.400" />;
    return <Icon as={QuestionOutlineIcon} color="gray.400" />;
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={3}
      borderColor={borderColor}
      w="220px"
      h="auto"
      position="relative"
      shadow="sm"
    >
      <Tooltip label="Xóa ảnh này" placement="top">
        <IconButton
          icon={<CloseButton />}
          size="xs"
          variant="ghost"
          colorScheme="red"
          position="absolute"
          top="2px"
          right="2px"
          onClick={() => onRemove(id)}
          aria-label="Xóa ảnh"
        />
      </Tooltip>
      <VStack spacing={2}>
        <Box
          w="full"
          h="120px"
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
          overflow="hidden"
          bg={useColorModeValue("gray.50", "gray.700")}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {previewFailed ? (
            <Center
              h="full"
              w="full"
              bg={useColorModeValue("red.50", "red.800")}
              p={2}
            >
              <VStack spacing={1}>
                <Icon as={FiAlertCircle} w={5} h={5} color={errorColor} />
                <Text fontSize="xs" color={errorColor} textAlign="center">
                  Xem trước lỗi
                </Text>
              </VStack>
            </Center>
          ) : previewUrl ? (
            <Image
              src={previewUrl}
              alt={`Xem trước ${file.name}`}
              objectFit="contain"
              w="full"
              h="full"
            />
          ) : (
            <Center h="full" w="full">
              <Text fontSize="xs" color="gray.400">
                Đang tải...
              </Text>
            </Center>
          )}
        </Box>
        <Tooltip label={file.name} placement="bottom" openDelay={300}>
          <Text
            fontSize="xs"
            fontWeight="medium"
            noOfLines={1}
            title={file.name}
            w="full"
            textAlign="center"
            px={1}
          >
            {file.name}
          </Text>
        </Tooltip>
        <Flex align="center" justify="space-between" w="full" px={1}>
          <Flex align="center" gap={1}>
            {getStatusIcon()}
            <Text fontSize="2xs" color="gray.500" textTransform="capitalize">
              {status}
            </Text>
          </Flex>
          {status === "thành công" && prediction && (
            <Tooltip label="Xem kết quả chi tiết" placement="top">
              <IconButton
                icon={<FiEye />}
                size="xs"
                variant="outline"
                colorScheme="blue"
                aria-label="Xem kết quả"
                onClick={() => onViewResult(prediction)}
              />
            </Tooltip>
          )}
        </Flex>
        {status === "thất bại" && error && (
          <Tooltip label={error} placement="bottom" openDelay={300}>
            <Text
              fontSize="2xs"
              color={errorColor}
              noOfLines={1}
              title={error}
              px={1}
              w="full"
            >
              Lỗi: {error.substring(0, 25)}
              {error.length > 25 ? "..." : ""}
            </Text>
          </Tooltip>
        )}
      </VStack>
    </Box>
  );
};
// --- END: COMPONENT UploadedImageItem ---

// --- START: COMPONENT WorkerInformationForm (No changes here from previous version) ---
interface WorkerInformationFormProps {
  workerInfo: WorkerInfo;
  isSubmitted: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onEdit: () => void;
}

const WorkerInformationForm: React.FC<WorkerInformationFormProps> = ({
  workerInfo,
  isSubmitted,
  onInputChange,
  onSubmit,
  onEdit,
}) => {
  const formBg = useColorModeValue("white", "gray.750");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={formBg}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading
          size="md"
          color={headingColor}
          display="flex"
          alignItems="center"
        >
          <Icon as={FiUser} mr={2} /> Thông tin Người Khảo sát (Công nhân)
        </Heading>
        {isSubmitted && (
          <Button
            leftIcon={<FiEdit2 />}
            size="sm"
            onClick={onEdit}
            variant="outline"
            colorScheme="blue"
          >
            Chỉnh sửa
          </Button>
        )}
      </Flex>
      {isSubmitted ? (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Tên công nhân:
            </Text>
            <Text fontWeight="medium" color={textColor}>
              {workerInfo.name || "Chưa nhập"}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Mã số:
            </Text>
            <Text fontWeight="medium" color={textColor}>
              {workerInfo.workerId || "Chưa nhập"}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500">
              Bộ phận:
            </Text>
            <Text fontWeight="medium" color={textColor}>
              {workerInfo.department || "Chưa nhập"}
            </Text>
          </Box>
        </SimpleGrid>
      ) : (
        <VStack
          spacing={4}
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel htmlFor="workerName" fontSize="sm">
                Tên công nhân
              </FormLabel>
              <Input
                id="workerName"
                name="name"
                value={workerInfo.name}
                onChange={onInputChange}
                placeholder="Nguyễn Văn A"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="workerId" fontSize="sm">
                Mã số công nhân
              </FormLabel>
              <Input
                id="workerId"
                name="workerId"
                value={workerInfo.workerId}
                onChange={onInputChange}
                placeholder="NV001"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="department" fontSize="sm">
                Bộ phận
              </FormLabel>
              <Input
                id="department"
                name="department"
                value={workerInfo.department}
                onChange={onInputChange}
                placeholder="Tổ May 1"
              />
            </FormControl>
          </SimpleGrid>
          <Button
            type="submit"
            colorScheme="teal"
            leftIcon={<FiCheckSquare />}
            alignSelf="flex-end"
          >
            Xác nhận thông tin
          </Button>
        </VStack>
      )}
    </Box>
  );
};
// --- END: COMPONENT WorkerInformationForm ---

// --- START: COMPONENT OverallResultsDisplay (No changes here from previous version) ---
interface OverallResultsDisplayProps {
  files: UploadedImageFile[];
  averageLevel: number | null;
  skillRank: { rank: number; label: string } | null;
  workerInfo: WorkerInfo | null;
}
const OverallResultsDisplay: React.FC<OverallResultsDisplayProps> = ({
  files,
  averageLevel,
  skillRank,
  workerInfo,
}) => {
  const successfulFilesWithLevel = files.filter(
    (f) =>
      f.status === "thành công" &&
      f.prediction &&
      parseLevel(f.prediction.predictions.level.label) !== null
  );
  const allSuccessfulApiFiles = files.filter(
    (f) => f.status === "thành công" && f.prediction
  );

  const tableBg = useColorModeValue("white", "gray.750");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const shouldShowOverallBox =
    workerInfo || averageLevel !== null || skillRank !== null;

  // Determine if any file has been processed (attempted prediction)
  const anyFileProcessed = files.some(
    (f) => f.status === "thành công" || f.status === "thất bại"
  );
  const allAttemptedFilesFailed =
    anyFileProcessed &&
    files.filter((f) => f.status === "thành công").length === 0;

  if (
    allAttemptedFilesFailed &&
    !workerInfo &&
    averageLevel === null &&
    skillRank === null
  ) {
    return (
      <Center
        mt={8}
        p={5}
        borderWidth="1px"
        borderRadius="md"
        borderColor={useColorModeValue("red.300", "red.600")}
        bg={useColorModeValue("red.50", "red.800")}
      >
        <Text color={useColorModeValue("red.700", "red.200")}>
          Tất cả các ảnh đều xử lý thất bại hoặc không có dữ liệu cấp độ hợp lệ.
        </Text>
      </Center>
    );
  }

  if (!shouldShowOverallBox && !anyFileProcessed) {
    return null;
  }

  return (
    <VStack spacing={8} mt={10} align="stretch">
      <HeaderWithLines
        title="Đánh giá Tổng quan & Xếp loại Tay nghề"
        icon={FiAward}
      />

      {shouldShowOverallBox && (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={tableBg}>
          <Heading size="md" mb={4} color={headingColor}>
            Xếp loại Tay nghề Chuyên nghiệp
          </Heading>
          <StatGroup
            borderWidth="1px"
            borderColor={useColorModeValue("gray.200", "gray.600")}
            borderRadius="md"
            p={4}
            flexDirection={{ base: "column", md: "row" }}
            sx={{
              "& > *:not(:last-child)": {
                mb: { base: 4, md: 0 },
                mr: { base: 0, md: 4 },
              },
            }}
          >
            {workerInfo &&
              (workerInfo.name ||
                workerInfo.workerId ||
                workerInfo.department) && (
                <>
                  <Stat>
                    <StatLabel>Tên Công nhân</StatLabel>
                    <StatNumber fontSize="lg" color={textColor}>
                      {workerInfo.name || "N/A"}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Mã số</StatLabel>
                    <StatNumber fontSize="lg" color={textColor}>
                      {workerInfo.workerId || "N/A"}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Bộ phận</StatLabel>
                    <StatNumber fontSize="lg" color={textColor}>
                      {workerInfo.department || "N/A"}
                    </StatNumber>
                  </Stat>
                </>
              )}
            {averageLevel !== null && (
              <Stat>
                <StatLabel>Điểm Cấp độ TB</StatLabel>
                <StatNumber>{averageLevel.toFixed(2)}</StatNumber>
                <StatHelpText>
                  (Từ {successfulFilesWithLevel.length} ảnh hợp lệ)
                </StatHelpText>
              </Stat>
            )}
            {skillRank !== null && (
              <Stat>
                <StatLabel>Bậc thợ (1-5)</StatLabel>
                <StatNumber color={headingColor} fontSize="2xl">
                  {skillRank.rank}
                </StatNumber>
                <StatHelpText fontWeight="medium" fontSize="md">
                  {skillRank.label}
                </StatHelpText>
              </Stat>
            )}
          </StatGroup>
          {successfulFilesWithLevel.length === 0 &&
            (averageLevel !== null || skillRank !== null) && (
              <Text mt={3} fontSize="sm" color="orange.500">
                Lưu ý: Đánh giá hiện tại có thể dựa trên dữ liệu đã xử lý trước
                đó hoặc không có ảnh nào đóng góp vào điểm cấp độ.
              </Text>
            )}
        </Box>
      )}

      {allSuccessfulApiFiles.length > 0 && (
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={tableBg}>
          <Heading
            size="md"
            mb={4}
            color={headingColor}
            display="flex"
            alignItems="center"
          >
            <Icon as={FiBarChart2} mr={2} /> Chi tiết Kết quả Từng Ảnh (Thành
            công)
          </Heading>
          <TableContainer>
            <Table variant="striped" colorScheme="gray" size="sm">
              <Thead>
                <Tr>
                  <Th>STT</Th>
                  <Th>Tên file</Th>
                  <Th>Loại chính</Th>
                  <Th>Loại phụ</Th>
                  <Th>Cấp độ (API)</Th>
                  <Th>Độ tin cậy (Cấp độ)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {allSuccessfulApiFiles.map((item, index) => (
                  <Tr key={item.id}>
                    <Td>{index + 1}</Td>
                    <Td
                      maxW="200px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      title={item.file.name}
                    >
                      {item.file.name}
                    </Td>
                    <Td>
                      {item.prediction!.predictions.category.label || "N/A"}
                    </Td>
                    <Td>
                      {item.prediction!.predictions.sub_category.label || "N/A"}
                    </Td>
                    <Td>{item.prediction!.predictions.level.label || "N/A"}</Td>
                    <Td>
                      {item.prediction!.predictions.level.confidence || "N/A"}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </VStack>
  );
};
// --- END: COMPONENT OverallResultsDisplay ---

// --- START: Utility function ---
const parseLevel = (levelLabel: string): number | null => {
  if (!levelLabel) return null;
  const match = levelLabel.match(/Level\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
};
// --- END: Utility function ---

// --- START: Component Upload (Component chính của trang) ---
const Upload: React.FC = () => {
  const accentHeadingColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const dropzoneBorderColor = useColorModeValue("gray.300", "gray.600");
  const dropzoneBg = useColorModeValue("gray.50", "gray.700");
  const dropzoneHoverBg = useColorModeValue("gray.100", "gray.600");

  const [workerInfo, setWorkerInfo] = useState<WorkerInfo>({
    name: "",
    workerId: "",
    department: "",
  });
  const [isWorkerInfoSubmitted, setIsWorkerInfoSubmitted] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedImageFile[]>([]);
  const [overallPredictionInProgress, setOverallPredictionInProgress] =
    useState(false);
  const [averageLevel, setAverageLevel] = useState<number | null>(null);
  const [skillRank, setSkillRank] = useState<{
    rank: number;
    label: string;
  } | null>(null);
  const [currentDetailedPrediction, setCurrentDetailedPrediction] =
    useState<PredictionResponseForDisplay | null>(null);

  // State for Firebase save operation
  const [isSavingToFirebase, setIsSavingToFirebase] = useState(false);

  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentFiles = uploadedFiles;
    return () => {
      currentFiles.forEach((imageFile) => {
        if (imageFile.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(imageFile.previewUrl);
        }
      });
    };
  }, [uploadedFiles]);

  const handleWorkerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkerInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmitWorkerInfo = () => {
    if (!workerInfo.name || !workerInfo.workerId || !workerInfo.department) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin công nhân.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsWorkerInfoSubmitted(true);
    toast({
      title: "Đã lưu thông tin công nhân.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEditWorkerInfo = () => {
    setIsWorkerInfoSubmitted(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFilesFromInput = Array.from(event.target.files);
      const MAX_FILES = 14;
      const currentFileCount = uploadedFiles.length;

      if (currentFileCount + newFilesFromInput.length > MAX_FILES) {
        toast({
          title: "Quá nhiều ảnh",
          description: `Bạn chỉ có thể tải lên tối đa ${MAX_FILES} ảnh. Hiện có ${currentFileCount}, bạn chọn thêm ${newFilesFromInput.length}.`,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const newProcessedFiles = newFilesFromInput
        .map((file): UploadedImageFile | null => {
          const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/heic",
            "image/heif",
          ];
          const isHeicExtension =
            file.name.toLowerCase().endsWith(".heic") ||
            file.name.toLowerCase().endsWith(".heif");

          if (!allowedMimeTypes.includes(file.type) && !isHeicExtension) {
            toast({
              title: "Loại file không hợp lệ.",
              description: `File '${file.name}' có loại '${
                file.type || "không xác định"
              }' không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP, HEIC, HEIF.`,
              status: "error",
              duration: 6000,
              isClosable: true,
            });
            return null;
          }

          let previewUrl = "";
          let previewFailed = true;
          try {
            previewUrl = URL.createObjectURL(file);
            previewFailed = false;
          } catch (e) {
            console.error(
              "[Upload Component] Error creating object URL for file:",
              file.name,
              e
            );
            toast({
              title: `Lỗi tạo xem trước cho ${file.name}`,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
          return {
            id: `${file.name}-${
              file.lastModified
            }-${performance.now()}-${Math.random()
              .toString(36)
              .substring(2, 9)}`,
            file,
            previewUrl,
            status: "chờ xử lý",
            previewFailed,
          };
        })
        .filter(Boolean) as UploadedImageFile[];

      if (newProcessedFiles.length > 0) {
        setUploadedFiles((prevFiles) => [...prevFiles, ...newProcessedFiles]);
        setCurrentDetailedPrediction(null);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = (idToRemove: string) => {
    setUploadedFiles((prevFiles) => {
      const fileToRemove = prevFiles.find((f) => f.id === idToRemove);
      if (fileToRemove && fileToRemove.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      const remainingFiles = prevFiles.filter((f) => f.id !== idToRemove);

      let newOverallLevelSum = 0;
      let newOverallSuccessfulFilesWithLevel = 0;
      remainingFiles.forEach((file) => {
        if (file.status === "thành công" && file.prediction) {
          const levelNum = parseLevel(file.prediction.predictions.level.label);
          if (levelNum !== null) {
            newOverallLevelSum += levelNum;
            newOverallSuccessfulFilesWithLevel++;
          }
        }
      });
      if (newOverallSuccessfulFilesWithLevel > 0) {
        const avg = newOverallLevelSum / newOverallSuccessfulFilesWithLevel;
        setAverageLevel(avg);
        setSkillRank(classifySkill(avg));
      } else {
        setAverageLevel(null);
        setSkillRank(null);
      }
      return remainingFiles;
    });
  };

  const classifySkill = (
    avgLevel: number
  ): { rank: number; label: string } | null => {
    if (avgLevel < 1.5) return { rank: 1, label: "Tập sự" };
    if (avgLevel < 2.5) return { rank: 2, label: "Sơ cấp" };
    if (avgLevel < 3.5) return { rank: 3, label: "Trung cấp" };
    if (avgLevel < 4.5) return { rank: 4, label: "Khá" };
    if (avgLevel >= 4.5) return { rank: 5, label: "Giỏi/Chuyên gia" };
    return null;
  };

  const handlePredictAll = async () => {
    if (
      !isWorkerInfoSubmitted &&
      (!workerInfo.name || !workerInfo.workerId || !workerInfo.department)
    ) {
      toast({
        title: "Thiếu thông tin công nhân",
        description:
          "Vui lòng nhập và xác nhận thông tin công nhân trước khi đánh giá.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    } else if (!isWorkerInfoSubmitted) {
      handleSubmitWorkerInfo();
      if (!workerInfo.name || !workerInfo.workerId || !workerInfo.department)
        return;
    }

    const filesToPredict = uploadedFiles.filter(
      (f) => f.status === "chờ xử lý" || f.status === "thất bại"
    );

    if (filesToPredict.length === 0) {
      toast({
        title:
          uploadedFiles.length > 0
            ? "Không có ảnh mới hoặc ảnh lỗi để đánh giá lại"
            : "Không có ảnh nào được chọn",
        description:
          uploadedFiles.length > 0
            ? "Tất cả ảnh đã chọn đã được xử lý."
            : "Vui lòng chọn ảnh để tải lên.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setOverallPredictionInProgress(true);
    setCurrentDetailedPrediction(null);

    setUploadedFiles((prevFiles) =>
      prevFiles.map((f) =>
        filesToPredict.find((ftp) => ftp.id === f.id)
          ? { ...f, status: "đang tải", error: null, prediction: null }
          : f
      )
    );

    const predictionPromises = filesToPredict.map(async (imageFile) => {
      const formData = new FormData();
      formData.append("file", imageFile.file, imageFile.file.name);
      try {
        const response = await fetch(PREDICT_API_URL, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          let errorDetail = `Lỗi server: ${response.status}`;
          try {
            const errorJson = await response.json();
            errorDetail =
              errorJson?.message ||
              errorJson?.error ||
              JSON.stringify(errorJson);
          } catch (e) {
            try {
              errorDetail = await response.text();
            } catch (textErr) {
              /* ignore */
            }
          }
          throw new Error(errorDetail);
        }
        const apiData: PredictionResponseFromApi = await response.json();
        if (apiData.error) throw new Error(apiData.error);
        if (!apiData.filename || !apiData.predictions)
          throw new Error("Dữ liệu API trả về không đầy đủ.");
        return {
          id: imageFile.id,
          status: "thành công",
          prediction: {
            filename: apiData.filename,
            predictions: apiData.predictions,
          } as PredictionResponseForDisplay,
          error: null,
        };
      } catch (err: any) {
        console.error(
          `[Upload Component] Prediction error for ${imageFile.file.name}:`,
          err
        );
        return {
          id: imageFile.id,
          status: "thất bại",
          error: err.message || "Lỗi API",
          prediction: null,
        };
      }
    });

    const results = await Promise.allSettled(predictionPromises);

    let batchSuccessCountForToast = 0;
    const batchAttemptedCount = filesToPredict.length;

    results.forEach((r) => {
      if (r.status === "fulfilled") {
        const value = r.value as {
          status: PredictionStatus;
          prediction?: PredictionResponseForDisplay;
        };
        if (value.status === "thành công" && value.prediction)
          batchSuccessCountForToast++;
      }
    });

    setUploadedFiles((prevFiles) => {
      let newOverallLevelSum = 0;
      let newOverallSuccessfulFilesWithLevel = 0;
      const updatedFiles = prevFiles.map((existingFile) => {
        let returnFile = { ...existingFile };
        const resultFromBatch = results.find(
          (r) =>
            (r.status === "fulfilled" && r.value.id === existingFile.id) ||
            (r.status === "rejected" &&
              (r.reason as any)?.id === existingFile.id)
        );
        if (resultFromBatch) {
          if (resultFromBatch.status === "fulfilled") {
            const resValue = resultFromBatch.value;
            returnFile = {
              ...existingFile,
              status: resValue.status,
              prediction: resValue.prediction || null,
              error: resValue.error || null,
            };
          } else {
            returnFile = {
              ...existingFile,
              status: "thất bại",
              error:
                (resultFromBatch.reason as Error)?.message ||
                "Lỗi xử lý bất đồng bộ",
              prediction: null,
            };
          }
        }
        if (returnFile.status === "thành công" && returnFile.prediction) {
          const levelNum = parseLevel(
            returnFile.prediction.predictions.level.label
          );
          if (levelNum !== null) {
            newOverallLevelSum += levelNum;
            newOverallSuccessfulFilesWithLevel++;
          }
        }
        return returnFile;
      });
      if (newOverallSuccessfulFilesWithLevel > 0) {
        const avg = newOverallLevelSum / newOverallSuccessfulFilesWithLevel;
        setAverageLevel(avg);
        setSkillRank(classifySkill(avg));
      } else {
        setAverageLevel(null);
        setSkillRank(null);
      }
      return updatedFiles;
    });

    setOverallPredictionInProgress(false);

    if (batchAttemptedCount > 0) {
      if (batchSuccessCountForToast === 0) {
        toast({
          title: "Xử lý thất bại",
          description: `Tất cả ${batchAttemptedCount} ảnh trong lượt này không thể xử lý.`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (batchSuccessCountForToast === batchAttemptedCount) {
        toast({
          title: "Hoàn tất đánh giá!",
          description: `Đã xử lý ${batchAttemptedCount} ảnh. Tất cả ${batchSuccessCountForToast} ảnh thành công.`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Hoàn tất xử lý với một số lỗi",
          description: `${batchSuccessCountForToast}/${batchAttemptedCount} ảnh xử lý thành công.`,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleSaveToFirebase = async () => {
    if (
      !isWorkerInfoSubmitted ||
      !workerInfo.name ||
      !averageLevel ||
      !skillRank
    ) {
      toast({
        title: "Thiếu thông tin để lưu",
        description:
          "Vui lòng đảm bảo thông tin công nhân đã được xác nhận và có kết quả đánh giá.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const successfulUploads = uploadedFiles.filter(
      (f) => f.status === "thành công" && f.prediction
    );

    if (successfulUploads.length === 0) {
      toast({
        title: "Không có dữ liệu ảnh thành công",
        description: "Không có ảnh nào được xử lý thành công để lưu kết quả.",
        status: "info",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsSavingToFirebase(true);

    const processedImagesData: SavedImagePrediction[] = successfulUploads.map(
      (file) => ({
        filename: file.file.name, // Using original file name
        category: file.prediction!.predictions.category,
        sub_category: file.prediction!.predictions.sub_category,
        level: file.prediction!.predictions.level,
        orientation: file.prediction!.predictions.orientation,
      })
    );

    const assessmentData: AssessmentRecord = {
      workerInfo: workerInfo,
      averageLevel: parseFloat(averageLevel.toFixed(2)), // Ensure number
      skillRankLabel: skillRank.label,
      skillRankValue: skillRank.rank,
      processedImages: processedImagesData,
      savedAt: Timestamp.now(), // Firebase Timestamp
      // sessionId: // generate a unique session ID if needed
    };

    try {
      const docRef = await addDoc(
        collection(db, "skillAssessments"),
        assessmentData
      );
      toast({
        title: "Lưu thành công!",
        description: `Kết quả đã được lưu vào Firebase với ID: ${docRef.id}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error("Error saving to Firebase: ", error);
      toast({
        title: "Lỗi khi lưu vào Firebase",
        description:
          error.message || "Không thể lưu kết quả. Vui lòng thử lại.",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    } finally {
      setIsSavingToFirebase(false);
    }
  };

  const handleDropzoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const filesReadyToPredictCount = useMemo(
    () =>
      uploadedFiles.filter(
        (f) => f.status === "chờ xử lý" || f.status === "thất bại"
      ).length,
    [uploadedFiles]
  );

  const processedSuccessfullyFilesCount = useMemo(
    () =>
      uploadedFiles.filter((f) => f.status === "thành công" && f.prediction)
        .length,
    [uploadedFiles]
  );

  const canSaveToFirebase = useMemo(
    () =>
      isWorkerInfoSubmitted &&
      workerInfo.name &&
      workerInfo.workerId &&
      workerInfo.department &&
      averageLevel !== null &&
      skillRank !== null &&
      processedSuccessfullyFilesCount > 0,
    [
      isWorkerInfoSubmitted,
      workerInfo,
      averageLevel,
      skillRank,
      processedSuccessfullyFilesCount,
    ]
  );

  return (
    <>
      <NavBar />
      <Box as="main">
        <Container
          maxW="container.xl"
          py={{ base: 6, md: 10 }}
          px={{ base: 4, md: 6 }}
        >
          <VStack
            spacing={{ base: 3, md: 4 }}
            textAlign="center"
            mb={{ base: 8, md: 12 }}
          >
            <Heading
              as="h1"
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              color={accentHeadingColor}
              lineHeight="1.2"
            >
              ĐÁNH GIÁ TAY NGHỀ MAY QUA THỊ GIÁC MÁY TÍNH
            </Heading>
            <Image
              src="/image/pie.png"
              alt="Minh họa công nghệ đánh giá đường may"
              borderRadius="lg"
              w={{ base: "200px", md: "300px" }}
              h={{ base: "120px", md: "180px" }}
              objectFit="contain"
              my={4}
              onError={(e) => {
                console.error("Lỗi tải ảnh tĩnh (pie.png):", e.type);
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color={textColor}
              maxW={{ base: "full", md: "3xl" }}
              mx="auto"
            >
              Hệ thống sử dụng Thị giác Máy tính (CV) và Trí tuệ Nhân tạo (AI)
              để phân tích, đánh giá chất lượng đường may dựa trên hình ảnh. Tải
              ảnh sản phẩm để nhận đánh giá chi tiết và xếp loại tay nghề.
            </Text>
          </VStack>

          <VStack
            spacing={{ base: 6, md: 8 }}
            align="stretch"
            mb={{ base: 8, md: 12 }}
          >
            <WorkerInformationForm
              workerInfo={workerInfo}
              isSubmitted={isWorkerInfoSubmitted}
              onInputChange={handleWorkerInfoChange}
              onSubmit={handleSubmitWorkerInfo}
              onEdit={handleEditWorkerInfo}
            />
          </VStack>

          <VStack
            spacing={{ base: 6, md: 8 }}
            alignItems="stretch"
            mb={{ base: 8, md: 12 }}
          >
            <HeaderWithLines
              title="Tải ảnh & Đánh giá Hàng loạt"
              icon={FiUploadCloud}
            />
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={textColor}
              textAlign="center"
              fontWeight="500"
              mb={4}
            >
              Yêu cầu ảnh tải lên: (Tối đa 14 ảnh, JPG, PNG, WEBP, HEIC)
            </Text>
            <List
              spacing={1}
              alignSelf="center"
              maxW={{ base: "full", md: "lg" }}
              color={useColorModeValue("gray.700", "gray.300")}
              fontSize={{ base: "xs", md: "sm" }}
              mb={6}
              styleType="none"
            >
              <ListItem color="gray">
                <Flex align="center">
                  <Icon as={CheckCircleIcon} color="green.500" mr={2} /> Ảnh rõ
                  nét, đủ sáng.
                </Flex>
              </ListItem>
              <ListItem color="gray">
                <Flex align="center">
                  <Icon as={CheckCircleIcon} color="green.500" mr={2} /> Góc
                  chụp thẳng, không nghiêng.
                </Flex>
              </ListItem>
              <ListItem color="gray">
                <Flex align="center">
                  <Icon as={CheckCircleIcon} color="green.500" mr={2} /> Thấy rõ
                  chi tiết mũi chỉ.
                </Flex>
              </ListItem>
            </List>

            <Box mx="auto" w="full">
              <VStack spacing={6} align="stretch" w="full">
                <Box
                  p={{ base: 4, md: 6 }}
                  borderWidth="2px"
                  borderStyle="dashed"
                  borderColor={dropzoneBorderColor}
                  borderRadius="lg"
                  bg={dropzoneBg}
                  _hover={{ bg: dropzoneHoverBg, borderColor: "teal.400" }}
                  onClick={handleDropzoneClick}
                  cursor="pointer"
                >
                  <Input
                    type="file"
                    accept="image/jpeg, image/png, image/webp, image/heic, image/heif, .heic, .heif"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    id="fileUploadInputMultiple"
                    multiple
                  />
                  <VStack spacing={3} textAlign="center" py={5}>
                    <Icon as={FiUploadCloud} w={12} h={12} color="teal.500" />
                    <Text fontWeight="medium" fontSize="lg">
                      Nhấn hoặc kéo thả ảnh vào đây
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      Hỗ trợ nhiều file (tối đa 7 ảnh)
                    </Text>
                  </VStack>
                </Box>

                {uploadedFiles.length > 0 && (
                  <Box>
                    <Heading size="sm" mb={3} color={textColor}>
                      Ảnh đã chọn ({uploadedFiles.length}/7):
                    </Heading>
                    <Wrap spacing={4} justify="start">
                      {uploadedFiles.map((imageFile) => (
                        <WrapItem key={imageFile.id}>
                          <UploadedImageItem
                            imageFile={imageFile}
                            onRemove={removeFile}
                            onViewResult={(prediction) =>
                              setCurrentDetailedPrediction(prediction)
                            }
                          />
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                )}

                {uploadedFiles.length > 0 && (
                  <Button
                    onClick={handlePredictAll}
                    isLoading={overallPredictionInProgress}
                    loadingText="Đang xử lý..."
                    colorScheme="teal"
                    size="lg"
                    leftIcon={<FiFile />}
                    isDisabled={
                      (filesReadyToPredictCount === 0 &&
                        !overallPredictionInProgress) ||
                      overallPredictionInProgress
                    }
                    w="full"
                    py={6}
                    mt={4}
                  >
                    {overallPredictionInProgress
                      ? `Đang đánh giá ${filesReadyToPredictCount} ảnh...`
                      : filesReadyToPredictCount > 0
                      ? `Đánh giá ${filesReadyToPredictCount} ảnh mới/lỗi`
                      : processedSuccessfullyFilesCount > 0
                      ? `Tất cả ${processedSuccessfullyFilesCount} ảnh đã xử lý`
                      : `Không có ảnh để đánh giá`}
                  </Button>
                )}

                {currentDetailedPrediction && (
                  <Box
                    mt={6}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    shadow="lg"
                    bg={useColorModeValue("white", "gray.750")}
                  >
                    <Flex justify="space-between" align="center" mb={2}>
                      <Heading size="md" color={accentHeadingColor}>
                        Chi tiết ảnh: {currentDetailedPrediction.filename}
                      </Heading>
                      <Tooltip label="Đóng xem chi tiết" placement="top">
                        <IconButton
                          icon={<CloseButton />}
                          size="sm"
                          variant="ghost"
                          onClick={() => setCurrentDetailedPrediction(null)}
                          aria-label="Đóng chi tiết"
                        />
                      </Tooltip>
                    </Flex>
                    <PredictionResults data={currentDetailedPrediction} />
                  </Box>
                )}

                {(isWorkerInfoSubmitted ||
                  averageLevel !== null ||
                  skillRank !== null ||
                  uploadedFiles.some(
                    (f) => f.status === "thành công" || f.status === "thất bại"
                  )) &&
                  !overallPredictionInProgress && (
                    <OverallResultsDisplay
                      files={uploadedFiles}
                      averageLevel={averageLevel}
                      skillRank={skillRank}
                      workerInfo={isWorkerInfoSubmitted ? workerInfo : null}
                    />
                  )}

                {/* Save to Firebase Button */}
                {canSaveToFirebase && !overallPredictionInProgress && (
                  <Button
                    onClick={handleSaveToFirebase}
                    isLoading={isSavingToFirebase}
                    loadingText="Đang lưu..."
                    colorScheme="purple" // Different color for save
                    size="lg"
                    leftIcon={<FiSave />}
                    w="full"
                    py={6}
                    mt={6} // Add some margin top
                  >
                    Lưu Kết Quả vào Cơ sở dữ liệu
                  </Button>
                )}

                {uploadedFiles.length === 0 && !overallPredictionInProgress && (
                  <Box
                    mt={8}
                    p={{ base: 4, md: 6 }}
                    borderWidth="1px"
                    borderRadius="md"
                    textAlign="center"
                    minH="120px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={useColorModeValue("white", "gray.750")}
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                  >
                    <Text
                      fontStyle="italic"
                      color={useColorModeValue("gray.500", "gray.400")}
                    >
                      Vui lòng chọn ảnh để tải lên và đánh giá.
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>
      <Footer />
      {/* <HealthTips /> */}
    </>
  );
};
// --- END: Component Upload ---

export default Upload;
