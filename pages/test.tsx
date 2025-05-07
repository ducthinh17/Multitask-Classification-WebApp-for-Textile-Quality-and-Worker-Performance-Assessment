import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import HealthTips from "../components/HealthTips";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import {
  Box,
  Button,
  Heading,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Select,
  VStack,
  Card,
  CardHeader,
  CardBody,
  RadioGroup,
  Radio,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  SimpleGrid,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FormData {
  name: string;
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female";
  activityLevel:
    | "sedentary"
    | "lightlyActive"
    | "moderatelyActive"
    | "veryActive";
  systolic: number;
  diastolic: number;
  heightCm: number;
}

const SurveyTest = () => {
  const { control, watch } = useForm<FormData>();
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<any>(null);
  const toast = useToast();

  const temporaryData = {
    name: watch("name"),
    weight: watch("weight"),
    height: watch("height"),
    age: watch("age"),
    gender: watch("gender"),
    activityLevel: watch("activityLevel"),
    systolic: watch("systolic"),
    diastolic: watch("diastolic"),
    heightCm: watch("heightCm"),
  };

  const steps = [
    {
      title: "Personal Information",
      content: (
        <>
          <FormControl mb={3} isRequired>
            <FormLabel>Name</FormLabel>
            <Controller
              control={control}
              name="name"
              rules={{ required: true }}
              render={({ field }) => <Input {...field} />}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Weight (kg)</FormLabel>
            <Controller
              control={control}
              name="weight"
              rules={{ required: true, min: 1 }}
              render={({ field }) => <Input type="number" {...field} />}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Height (cm)</FormLabel>
            <Controller
              control={control}
              name="height"
              rules={{ required: true, min: 1 }}
              render={({ field }) => <Input type="number" {...field} />}
            />
          </FormControl>
        </>
      ),
    },
    {
      title: "Calorie Calculator",
      content: (
        <>
          <FormControl mb={3} isRequired>
            <FormLabel>Age</FormLabel>
            <Controller
              control={control}
              name="age"
              rules={{ required: true, min: 1 }}
              render={({ field }) => <Input type="number" {...field} />}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Gender</FormLabel>
            <Controller
              control={control}
              name="gender"
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup onChange={field.onChange} value={field.value}>
                  <VStack alignItems="start">
                    <Radio value="male">Male</Radio>
                    <Radio value="female">Female</Radio>
                  </VStack>
                </RadioGroup>
              )}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Activity Level</FormLabel>
            <Controller
              control={control}
              name="activityLevel"
              rules={{ required: true }}
              render={({ field }) => (
                <Select {...field}>
                  <option value="sedentary">Sedentary</option>
                  <option value="lightlyActive">Lightly Active</option>
                  <option value="moderatelyActive">Moderately Active</option>
                  <option value="veryActive">Very Active</option>
                </Select>
              )}
            />
          </FormControl>
        </>
      ),
    },
    {
      title: "Blood Pressure Calculator",
      content: (
        <>
          <FormControl mb={3} isRequired>
            <FormLabel>Systolic Blood Pressure</FormLabel>
            <Controller
              control={control}
              name="systolic"
              rules={{ required: true, min: 1 }}
              render={({ field }) => <Input type="number" {...field} />}
            />
          </FormControl>
          <FormControl mb={3} isRequired>
            <FormLabel>Diastolic Blood Pressure</FormLabel>
            <Controller
              control={control}
              name="diastolic"
              rules={{ required: true, min: 1 }}
              render={({ field }) => <Input type="number" {...field} />}
            />
          </FormControl>
        </>
      ),
    },
    {
      title: "Ideal Body Weight Calculator",
      content: (
        <>
          <FormControl mb={3} isRequired>
            <FormLabel>Height (cm)</FormLabel>
            <Controller
              control={control}
              name="heightCm"
              rules={{ required: true, min: 1 }}
              render={({ field }) => <Input type="number" {...field} />}
            />
          </FormControl>
        </>
      ),
    },
  ];

  const calculateResults = () => {
    const heightInMeters = temporaryData.height / 100;
    const bmi = temporaryData.weight / (heightInMeters * heightInMeters);

    const bmr =
      temporaryData.gender === "male"
        ? 10 * temporaryData.weight +
          6.25 * temporaryData.height -
          5 * temporaryData.age +
          5
        : 10 * temporaryData.weight +
          6.25 * temporaryData.height -
          5 * temporaryData.age -
          161;

    const activityMultiplier = {
      sedentary: 1.2,
      lightlyActive: 1.375,
      moderatelyActive: 1.55,
      veryActive: 1.725,
    }[temporaryData.activityLevel];

    const dailyCalories = bmr * activityMultiplier;

    const idealBodyWeight =
      temporaryData.gender === "male"
        ? 50 + 0.91 * (temporaryData.heightCm - 152.4)
        : 45.5 + 0.91 * (temporaryData.heightCm - 152.4);

    let bloodPressureClassification: string | null = null;
    let bloodPressureIndex: number = 0;

    if (temporaryData.systolic && temporaryData.diastolic) {
      if (temporaryData.systolic < 90 || temporaryData.diastolic < 60) {
        bloodPressureClassification = "Hypotension (Low Blood Pressure)";
        bloodPressureIndex = 1;
      } else if (
        temporaryData.systolic >= 90 &&
        temporaryData.systolic <= 120 &&
        temporaryData.diastolic >= 60 &&
        temporaryData.diastolic <= 80
      ) {
        bloodPressureClassification = "Normal Blood Pressure";
        bloodPressureIndex = 2;
      } else if (
        temporaryData.systolic > 120 &&
        temporaryData.systolic <= 129 &&
        temporaryData.diastolic <= 80
      ) {
        bloodPressureClassification = "Elevated Blood Pressure";
        bloodPressureIndex = 3;
      } else if (
        (temporaryData.systolic >= 130 && temporaryData.systolic <= 139) ||
        (temporaryData.diastolic >= 80 && temporaryData.diastolic <= 89)
      ) {
        bloodPressureClassification = "Stage 1 Hypertension";
        bloodPressureIndex = 4;
      } else if (
        temporaryData.systolic >= 140 ||
        temporaryData.diastolic >= 90
      ) {
        bloodPressureClassification = "Stage 2 Hypertension";
        bloodPressureIndex = 5;
      }
    }

    setResults({
      bmi,
      dailyCalories,
      idealBodyWeight,
      bloodPressureClassification,
      age: temporaryData.age,
      bloodPressureIndex,
    });
  };

  const onSubmit = async () => {
    calculateResults();
    try {
      // Lưu dữ liệu vào Firestore
      await addDoc(collection(db, "user_test"), {
        name: temporaryData.name,
        age: temporaryData.age,
        height: temporaryData.height,
        weight: temporaryData.weight,
        gender: temporaryData.gender,
        activityLevel: temporaryData.activityLevel,
        systolic: temporaryData.systolic,
        diastolic: temporaryData.diastolic,
        timestamp: new Date(),
        results,
      });

      toast({
        title: "Data Saved",
        description: "Your survey results have been saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving document: ", error);
      toast({
        title: "Error Saving Data",
        description: "There was an error saving your data. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <NavBar />

      <Box p={5}>
        <Heading as="h1" mb={5}>
          Health Calculator Survey
        </Heading>
        <Card>
          <CardHeader>
            <Heading as="h3" size="lg">
              {steps[currentStep].title}
            </Heading>
          </CardHeader>
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  onSubmit();
                }
              }}
            >
              {steps[currentStep].content}
              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button
                  colorScheme="blue" // Màu cho nút "Previous"
                  variant="outline" // Tùy chọn viền để tạo sự nhẹ nhàng
                  width="48%"
                  type="button"
                  onClick={() =>
                    setCurrentStep(currentStep > 0 ? currentStep - 1 : 0)
                  }
                  isDisabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button
                  colorScheme="green" // Màu cho nút "Next/Submit"
                  variant="solid" // Tùy chọn màu đầy đủ cho nút này
                  width="48%"
                  type="submit"
                  isDisabled={!temporaryData.name}
                >
                  {currentStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </Box>
            </form>
          </CardBody>
        </Card>
        <br />
        {results && (
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Heading
              as="h2"
              size="lg"
              mb={5}
              fontWeight="semibold"
              textTransform="uppercase"
            >
              <Text as="span" fontWeight="bold">
                &#10070; Survey Results:
              </Text>
              <br />
              <br />

              <Flex
                direction="row"
                align="center"
                justify="space-between"
                mt={2}
                w="100%"
              >
                <Text as="span" fontWeight="bold" color="gray.600">
                  Name:
                  <Text as="span" fontWeight="bold" color="blue.600" ml={2}>
                    {temporaryData.name}
                  </Text>
                </Text>

                <Text as="span" fontWeight="bold" color="gray.600">
                  Age:
                  <Text as="span" fontWeight="bold" color="blue.600" ml={2}>
                    {temporaryData.age}
                  </Text>
                </Text>

                <Text as="span" fontWeight="bold" color="gray.600">
                  Height:
                  <Text as="span" fontWeight="bold" color="blue.600" ml={2}>
                    {temporaryData.height} CM
                  </Text>
                </Text>

                <Text as="span" fontWeight="bold" color="gray.600">
                  Weight:
                  <Text as="span" fontWeight="bold" color="blue.600" ml={2}>
                    {temporaryData.weight} KG
                  </Text>
                </Text>
              </Flex>
            </Heading>
            <br />
            {/* Statistics Row */}
            <Box mb={5}>
              <StatGroup
                className="result"
                display="flex"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "stretch",
                  gap: "0px",
                }} // Căn đều các phần tử và đảm bảo chiều cao bằng nhau
              >
                {[
                  {
                    label: "BMI",
                    value: results.bmi.toFixed(2),
                    width: "19%", // Chiếm 19% chiều ngang
                  },
                  {
                    label: "Daily Caloric Needs",
                    value: `${results.dailyCalories.toFixed(0)} kcal`,
                    width: "19%", // Chiếm 19% chiều ngang
                  },
                  {
                    label: "Ideal Body Weight",
                    value: `${results.idealBodyWeight.toFixed(2)} kg`,
                    width: "19%", // Chiếm 19% chiều ngang
                  },
                  {
                    label: "Blood Pressure Classification",
                    value: results.bloodPressureClassification || "N/A",
                    width: "40%", // Chiếm 40% chiều ngang
                  },
                ].map((stat, index) => (
                  <Box
                    key={index}
                    p={4}
                    sx={{
                      flexBasis: stat.width, // Đặt chiều ngang dựa trên giá trị đã xác định
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center", // Căn giữa nội dung theo chiều dọc
                      alignItems: "center", // Căn giữa nội dung theo chiều ngang
                      textAlign: "center", // Căn giữa văn bản
                      borderWidth: "1px", // Đặt khung cho mỗi phần tử
                      borderRadius: "lg", // Bo tròn góc
                      overflow: "hidden",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Thêm bóng cho khung
                    }}
                  >
                    <Stat sx={{ flex: 1 }}>
                      <StatLabel>{stat.label}</StatLabel>
                      <StatNumber>{stat.value}</StatNumber>
                    </Stat>
                  </Box>
                ))}
              </StatGroup>
            </Box>

            <SimpleGrid>
              {/* Left Column: Bar Chart */}
              <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
                <Heading as="h4" size="md" mb={2}>
                  Health Indicators
                </Heading>
                <Text mb={2}>
                  This chart illustrates your BMI, age, and ideal body weight,
                  helping you understand where you stand in relation to your
                  health goals.
                </Text>
                <Box height="300px" mb={5}>
                  <ResponsiveContainer>
                    <BarChart
                      data={[
                        { name: "BMI", value: results.bmi },
                        { name: "Age", value: results.age },
                        {
                          name: "Ideal Weight",
                          value: results.idealBodyWeight,
                        },
                      ]}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </SimpleGrid>
            <br />
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
              <Heading as="h4" size="md" mb={2} textAlign="center">
                Health Standards
              </Heading>
              <Text mb={2} textAlign="center">
                These charts provide visual insights into your caloric balance
                and BMI, giving you a better understanding of your health
                metrics.
              </Text>
              <SimpleGrid columns={2} spacing={55}>
                <Box textAlign="center">
                  <Image
                    src="../../image/energybalance_calories_chart.jpg"
                    alt="Calorie Balance Chart"
                    width="60%"
                    objectFit="cover"
                    mx="auto" // Center the image
                  />
                  <Text
                    textAlign="center"
                    fontSize="sm"
                    mt={2}
                    color="darkcyan"
                  >
                    Figure 1: Calorie Balance Table shows the relationship
                    between <strong>calories consumed</strong> and{" "}
                    <strong>calories burned</strong>, helping you manage your
                    weight effectively.
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Image
                    src="../../image/BMI-Chart-1.png"
                    alt="BMI Chart"
                    width="100%"
                    objectFit="cover"
                    mx="auto" // Center the image
                  />
                  <Text
                    textAlign="center"
                    fontSize="sm"
                    mt={2}
                    color="darkcyan"
                  >
                    Figure 2: BMI Chart illustrates the Body Mass Index (BMI)
                    categories, indicating whether an individual is{" "}
                    <strong>underweight</strong>, <strong>normal weight</strong>
                    , <strong>overweight</strong>, or <strong>obese</strong>{" "}
                    based on their height and weight.
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
          </Box>
        )}
      </Box>
      <HealthTips />
      <Footer />
    </>
  );
};

export default SurveyTest;
