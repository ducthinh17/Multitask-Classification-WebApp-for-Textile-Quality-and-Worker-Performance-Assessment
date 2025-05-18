import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  useColorMode,
  Button,
  Link,
} from "@chakra-ui/react";
import { IoMdMedkit, IoIosMedkit, IoIosHeart, IoIosBody } from "react-icons/io";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import HealthTips from "../components/HealthTips";

const Services = () => {
  const { colorMode } = useColorMode();

  const services = [
    {
      title: "Medical Consultation",
      description:
        "Expert medical advice and consultation for your health concerns.",
      icon: <IoMdMedkit size="2em" />,
    },
    {
      title: "Diagnostic Tests",
      description:
        "Comprehensive diagnostic tests to accurately assess your health condition.",
      icon: <IoIosMedkit size="2em" />,
    },
    {
      title: "Specialized Treatments",
      description: "Tailored treatment plans for various medical conditions.",
      icon: <IoIosHeart size="2em" />,
    },
    {
      title: "Preventive Care",
      description:
        "Guidance and services to maintain good health and prevent illnesses.",
      icon: <IoIosBody size="2em" />,
    },
  ];

  return (
    <Box>
      <NavBar />
      <div className="container">
        <div className="banner">
          <img
            src="../../image/explore-1.png"
            alt="Online Consultation"
            className="banner-image"
          />
          <div className="content">
            <h1> Services System</h1>
            <p>
              Connect face to face with a doctor, psychiatrist, or psychologist
              through video on your phone, tablet, or computer.
              <br />
              <br />
              Doctor AI Included Health works with or without insurance and is
              available at reduced rates through many major health plans and
              large employers. You’ll always see your cost upfront and won’t
              receive a surprise bill after your visit.
              <br />
              <br />
              We offer two main features for comprehensive health checks: fundus
              image examination and a general health test that includes metrics
              such as BMI, weight, calories, blood pressure, and more.
            </p>
          </div>
        </div>
      </div>
      <Box py={16} mr={16} ml={16}>
        <Flex direction="column" align="center" mb={10}>
          <Heading
            size="xl"
            color={colorMode === "light" ? "gray.700" : "white"}
          >
            Our Services
          </Heading>
          <Text mt={2} color={colorMode === "light" ? "gray.600" : "gray.400"}>
            Quality healthcare services tailored to your needs.
          </Text>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          {services.map((service) => (
            <Box
              key={service.title}
              bg={colorMode === "light" ? "white" : "gray.700"}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
            >
              <Flex justify="center" mb={4}>
                {service.icon}
              </Flex>
              <Heading
                size="md"
                mb={2}
                color={colorMode === "light" ? "gray.800" : "white"}
              >
                {service.title}
              </Heading>
              <Text color={colorMode === "light" ? "gray.600" : "gray.300"}>
                {service.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
        <Flex justify="center" mt={8} gap={6} wrap="wrap">
          <Button
            as={Link}
            href="/upload"
            colorScheme="orange"
            size="lg"
            px={10}
            py={6}
            fontSize="xl"
            boxShadow="lg"
            _hover={{ boxShadow: "xl", transform: "scale(1.05)" }}
          >
            Take Ocular Diseases Test
          </Button>
          <Button
            as={Link}
            href="/test"
            colorScheme="blue"
            size="lg"
            px={10}
            py={6}
            fontSize="xl"
            boxShadow="lg"
            _hover={{ boxShadow: "xl", transform: "scale(1.05)" }}
          >
            Take General Health Test
          </Button>
        </Flex>
      </Box>
      <HealthTips />
      <Footer />
    </Box>
  );
};

export default Services;
