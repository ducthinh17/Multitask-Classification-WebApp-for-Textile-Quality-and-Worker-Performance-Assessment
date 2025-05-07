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
  Input,
  Spinner,
  Heading,
  Stack,
  Flex,
} from "@chakra-ui/react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

// Define the User type
interface User {
  id: string; // Document ID
  name: string;
  age: number;
  gender: string;
  height: number; // Assuming height is a number
  activityLevel: string;
  diastolic: number; // Assuming diastolic is a number
  systolic: number; // Assuming systolic is a number
  results: {
    bloodPressureIndex?: number; // Adjust type as necessary
    dailyCalories?: number; // Adjust type as necessary
    bmi?: number; // Adjust type as necessary
    idealBodyWeight?: number; // Adjust type as necessary
    bloodPressureClassification?: string; // Adjust type as necessary
  } | null; // Allow results to be null
  timestamp: any; // Add the timestamp field
}

// AddUser component
const AddUser = () => {
  const [users, setUsers] = useState<User[]>([]); // Specify the state type
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const usersCollection = collection(db, "user_test"); // Reference to the Firestore collection
        const userSnapshot = await getDocs(usersCollection); // Get documents from the collection

        // Map the documents to an array of User objects
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          timestamp: doc.data().timestamp, // Ensure this matches your Firestore document structure
          ...(doc.data() as Omit<User, "id" | "timestamp">), // Exclude timestamp from the original User type for mapping
        }));

        setUsers(userList); // Set the fetched data in state
      } catch (error) {
        console.error("Error fetching users: ", error); // Handle any errors
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUsers(); // Call the fetch function
  }, []); // Empty dependency array to run once on mount

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              Patient Information
            </Heading>
          </Box>
          <Input
            placeholder="Search by name..."
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
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Name
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Age
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Gender
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Height (cm)
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Activity Level
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Diastolic
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Systolic
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Blood Pressure Index
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Daily Calories
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      BMI
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Ideal Body Weight (kg)
                    </Th>
                    <Th color="white" fontSize="md" fontWeight="bold" py={4}>
                      Blood Pressure Classification
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredUsers.map((user) => (
                    <Tr key={user.id} _hover={{ bg: "gray.100" }}>
                      <Td>
                        {user.timestamp
                          ? new Date(
                              user.timestamp.seconds * 1000
                            ).toLocaleString()
                          : "N/A"}
                      </Td>
                      <Td>{user.name}</Td>
                      <Td>{user.age}</Td>
                      <Td>{user.gender}</Td>
                      <Td>{user.height}</Td>
                      <Td>{user.activityLevel}</Td>
                      <Td>{user.diastolic}</Td>
                      <Td>{user.systolic}</Td>
                      <Td>
                        {user.results &&
                        user.results.bloodPressureIndex !== undefined
                          ? user.results.bloodPressureIndex.toFixed(2)
                          : "N/A"}
                      </Td>
                      <Td>
                        {user.results &&
                        user.results.dailyCalories !== undefined
                          ? user.results.dailyCalories.toFixed(2)
                          : "N/A"}
                      </Td>
                      <Td>
                        {user.results && user.results.bmi !== undefined
                          ? user.results.bmi.toFixed(2)
                          : "N/A"}
                      </Td>
                      <Td>
                        {user.results &&
                        user.results.idealBodyWeight !== undefined
                          ? user.results.idealBodyWeight.toFixed(2)
                          : "N/A"}
                      </Td>
                      <Td>
                        {user.results
                          ? user.results.bloodPressureClassification
                          : "N/A"}
                      </Td>
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

export default AddUser;
