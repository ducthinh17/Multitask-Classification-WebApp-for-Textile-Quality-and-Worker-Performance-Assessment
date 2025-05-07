import { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Container,
  Spinner,
  Heading,
  Stack,
  Flex,
  Image,
  Input, // Import Input for search
} from "@chakra-ui/react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Define the Disease type
interface Disease {
  id: string; // Document ID
  description: string;
  imagePath: string; // Image URL
  keyID: string; // New KeyID field
  label: string;
  prevention: string;
  timestamp: any; // Firestore timestamp
}

const RelatedDisease = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state

  useEffect(() => {
    const fetchDiseases = async () => {
      setLoading(true);
      try {
        const diseasesCollection = collection(db, "user_image"); // Reference to Firestore collection
        const diseaseSnapshot = await getDocs(diseasesCollection);

        // Map documents to an array of Disease objects
        const diseaseList = diseaseSnapshot.docs.map((doc) => ({
          id: doc.id,
          timestamp: doc.data().timestamp,
          ...(doc.data() as Omit<Disease, "id" | "timestamp">),
        }));

        // Group diseases by KeyID
        const groupedDiseases = diseaseList.reduce((acc, disease) => {
          const keyID = disease.keyID;
          if (!acc[keyID]) {
            acc[keyID] = {
              ...disease,
              count: 1, // Initialize count
              ids: [disease.id], // Keep track of document IDs
            };
          } else {
            acc[keyID].count += 1; // Increment count
            // Combine descriptions for grouped diseases
            acc[keyID].description += `; ${disease.description}`;
            acc[keyID].ids.push(disease.id); // Add the document ID

            // Maintain the latest timestamp if necessary
            if (
              disease.timestamp &&
              (!acc[keyID].timestamp ||
                disease.timestamp.seconds > acc[keyID].timestamp.seconds)
            ) {
              acc[keyID].timestamp = disease.timestamp;
            }
            // Use the first label encountered
            if (!acc[keyID].label) {
              acc[keyID].label = disease.label;
            }
            // Combine image paths if needed (just taking the first image for now)
            if (!acc[keyID].imagePath) {
              acc[keyID].imagePath = disease.imagePath;
            }
          }
          return acc;
        }, {} as Record<string, Disease & { count: number; ids: string[] }>);

        // Convert the grouped object into an array
        setDiseases(Object.values(groupedDiseases));
      } catch (error) {
        console.error("Error fetching diseases: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
  }, []);

  // Filter diseases based on the search term
  const filteredDiseases = diseases.filter(
    (disease) =>
      disease.label && // Kiểm tra label có tồn tại
      disease.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <br />
      <br />
      <br />

      <Container maxW="container.xl" p={5}>
        <Stack spacing={5} mt={8}>
          <Box
            bg="#057977"
            color="white"
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            textAlign="center"
          >
            <Heading
              as="h2"
              size="xl"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Ocular Information
            </Heading>
          </Box>

          {/* Search Input */}
          <Input
            placeholder="Search by label..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={5}
            borderColor="teal.500"
            focusBorderColor="teal.700"
          />

          {loading ? (
            <Flex justifyContent="center" alignItems="center" height="200px">
              <Spinner size="xl" color="teal.500" />
            </Flex>
          ) : (
            <Box
              overflowX="auto"
              border="1px"
              borderColor="gray.300"
              borderRadius="md"
              p={4}
            >
              <Table variant="striped" colorScheme="teal" size="md">
                <Thead bg="#538d94">
                  <Tr>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Timestamp
                    </Th>
                    <Th
                      color="white"
                      fontSize="md"
                      fontWeight="bold"
                      py={4}
                      width="200px" // Set width for Image column
                    >
                      Image
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Image Path
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Label
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredDiseases.map((disease) => (
                    <Tr key={disease.keyID} _hover={{ bg: "gray.100" }}>
                      <Td>
                        {disease.timestamp
                          ? new Date(
                              disease.timestamp.seconds * 1000
                            ).toLocaleString()
                          : "N/A"}
                      </Td>
                      <Td style={{ width: "200px" }}>
                        <Image
                          src={disease.imagePath}
                          alt={disease.label}
                          boxSize="150px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      </Td>
                      <Td>{disease.imagePath}</Td>
                      <Td>{disease.label}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Stack>
      </Container>
      <Footer />
    </>
  );
};

export default RelatedDisease;
