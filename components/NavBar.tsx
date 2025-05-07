import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  // useBreakpointValue, // Có thể không cần thiết nếu không có logic phức tạp dựa trên breakpoint
  useDisclosure,
  Input,
  InputGroup,
  InputRightElement,
  Avatar,
  useToast,
  Link as ChakraLink,
  HStack,
  VStack,
  Spacer, // Dùng để đẩy các phần tử ra xa nhau
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronRightIcon,
  SearchIcon,
  ChevronDownIcon,
  EmailIcon,
} from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import NextLink from "next/link";

// Firebase imports
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// --- Khai báo hằng số cho key ---
const COOKIE_USER_KEY = "app_user_session";
const LOCALSTORAGE_USER_KEY = "app_user";

// --- Tiện ích Cookie ---
function setCookie(name: string, value: string, hours: number) {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=Lax`;
}

// --- Interface cho NavItem ---
interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href: string;
  isExternal?: boolean;
}

// --- Danh sách các mục menu ---
const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Trang chủ",
    href: "/",
  },
  {
    label: "Về Chúng tôi",
    href: "/about",
  },
  {
    label: "Đánh giá",
    href: "/eyes",
  },
  {
    label: "Tính năng",
    href: "#",
    children: [
      {
        label: "Khám phá Tính năng A",
        subLabel: "Mô tả ngắn gọn về A",
        href: "/features/a",
      },
      {
        label: "Tìm hiểu Tính năng B",
        subLabel: "Mô tả về B",
        href: "/features/b",
      },
      {
        label: "Tài liệu bên ngoài",
        subLabel: "Mở trang Google.com",
        href: "https://google.com",
        isExternal: true,
      },
    ],
  },
];

// --- Thành phần NavBar chính ---
export default function NavBar() {
  const { isOpen: isMobileMenuOpen, onToggle: toggleMobileMenu } =
    useDisclosure();
  const router = useRouter();
  const toast = useToast();

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navbarBg = useColorModeValue("white", "gray.900");
  const navbarBorderColor = useColorModeValue("gray.200", "gray.700");
  const mainTextColor = useColorModeValue("gray.700", "gray.200");
  const brandNameColor = useColorModeValue("teal.600", "teal.400");
  const searchInputBg = useColorModeValue("gray.100", "gray.700");
  const searchInputFocusBg = useColorModeValue("white", "gray.800");
  const searchInputBorderFocusColor = useColorModeValue("teal.500", "teal.300");

  useEffect(() => {
    try {
      const storedUserString = localStorage.getItem(LOCALSTORAGE_USER_KEY);
      if (storedUserString) {
        setUser(JSON.parse(storedUserString) as FirebaseUser);
      }
    } catch (e) {
      localStorage.removeItem(LOCALSTORAGE_USER_KEY);
      deleteCookie(COOKIE_USER_KEY);
    }
    setIsLoadingUser(false);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsLoadingUser(true);
      if (currentUser) {
        const userDataToStore = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        };
        setUser(currentUser);
        localStorage.setItem(
          LOCALSTORAGE_USER_KEY,
          JSON.stringify(userDataToStore)
        );
        setCookie(COOKIE_USER_KEY, JSON.stringify(userDataToStore), 5);
      } else {
        setUser(null);
        localStorage.removeItem(LOCALSTORAGE_USER_KEY);
        deleteCookie(COOKIE_USER_KEY);
      }
      setIsLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      toast({
        title: `Chào mừng, ${result.user.displayName || "Người dùng"}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error: any) {
      console.error("Lỗi đăng nhập Google:", error);
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Đã đăng xuất.",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      router.push("/");
    } catch (error: any) {
      console.error("Lỗi đăng xuất:", error);
      toast({
        title: "Lỗi khi đăng xuất",
        description: error.message || "Vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      toast({
        title: "Nhập nội dung tìm kiếm.",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    window.open(
      `https://vi.wikipedia.org/w/index.php?search=${encodeURIComponent(
        trimmedQuery
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") handleSearch();
  };

  return (
    <Box position="relative" data-testid="navbar-container">
      <Flex
        as="header"
        bg={navbarBg}
        color={mainTextColor}
        minH={"70px"}
        py={{ base: 2 }}
        px={{ base: 4, md: 6, lg: 8 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={navbarBorderColor}
        alignItems={"center"}
        position="fixed"
        top={0}
        left={0}
        right={0}
        width="100%"
        zIndex="sticky"
        boxShadow="0 2px 4px rgba(0,0,0,0.05)"
        fontFamily="'Roboto', sans-serif"
      >
        <Flex alignItems="center" mr={{ base: 0, md: 4 }}>
          <IconButton
            onClick={toggleMobileMenu}
            icon={
              isMobileMenuOpen ? (
                <CloseIcon w={4} h={4} />
              ) : (
                <HamburgerIcon w={5} h={5} />
              )
            }
            variant="ghost"
            aria-label="Mở/Đóng menu điều hướng"
            display={{ base: "flex", md: "none" }}
            colorScheme="teal"
            mr={2}
          />
          <NextLink href="/" passHref>
            <ChakraLink
              display="flex"
              alignItems="center"
              _hover={{ textDecoration: "none" }}
            >
              <Image
                src="/image/logo.png"
                alt="Logo trang web"
                width={75}
                height={45}
              />
            </ChakraLink>
          </NextLink>
        </Flex>

        <Flex
          flexGrow={1}
          justifyContent={{ base: "flex-start", md: "center" }}
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          px={{ md: 4 }}
        >
          <DesktopNav navItems={NAV_ITEMS} />
        </Flex>

        <HStack
          spacing={{ base: 2, md: 4 }}
          alignItems="center"
          ml={{ base: "auto", md: 4 }}
        >
          <InputGroup size="md" maxW={{ md: "180px", lg: "250px" }}>
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              borderRadius="full"
              bg={searchInputBg}
              color={mainTextColor}
              _placeholder={{
                color: useColorModeValue("gray.500", "gray.400"),
              }}
              _focus={{
                bg: searchInputFocusBg,
                borderColor: searchInputBorderFocusColor,
                boxShadow: `0 0 0 1px ${searchInputBorderFocusColor}`,
              }}
              focusBorderColor={searchInputBorderFocusColor}
            />
            <InputRightElement>
              <IconButton
                aria-label="Tìm kiếm"
                icon={<SearchIcon />}
                size="sm"
                variant="ghost"
                colorScheme="teal"
                isRound
                onClick={handleSearch}
              />
            </InputRightElement>
          </InputGroup>
          {isLoadingUser ? (
            <Button
              isLoading
              colorScheme="teal"
              variant="ghost"
              aria-label="Đang tải"
            />
          ) : user ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <Button
              onClick={handleLogin}
              colorScheme="teal"
              variant="solid"
              size={{ base: "sm", md: "md" }}
              display={{ base: "none", md: "inline-flex" }}
              leftIcon={<EmailIcon />}
            >
              Đăng nhập
            </Button>
          )}
        </HStack>
      </Flex>
      <Collapse in={isMobileMenuOpen} animateOpacity>
        <MobileNav
          navItems={NAV_ITEMS}
          onClose={toggleMobileMenu}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          isLoadingUser={isLoadingUser}
        />
      </Collapse>
      <Box h="70px" data-testid="navbar-spacer" />
    </Box>
  );
}

interface UserMenuProps {
  user: FirebaseUser;
  onLogout: () => void;
}
const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const popoverBg = useColorModeValue("white", "gray.800");
  const popoverBorderColor = useColorModeValue("gray.200", "gray.700");
  const userNameColor = useColorModeValue("gray.800", "white");
  const userEmailColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Popover placement="bottom-end" closeOnBlur={true}>
      <PopoverTrigger>
        <Button
          variant="ghost"
          p={0}
          borderRadius="full"
          aria-label="Menu người dùng"
        >
          <Avatar
            size="sm"
            name={user.displayName || user.email || "User"}
            src={user.photoURL || undefined}
            bg="teal.500"
            color="white"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        bg={popoverBg}
        borderColor={popoverBorderColor}
        boxShadow="lg"
        p={4}
        rounded="md"
        w="auto"
        minW="220px"
        zIndex="popover"
      >
        <VStack alignItems="stretch" spacing={3}>
          <HStack spacing={3} alignItems="center">
            <Avatar
              size="md"
              name={user.displayName || user.email || "User"}
              src={user.photoURL || undefined}
            />
            <VStack alignItems="flex-start" spacing={0}>
              <Text
                fontWeight="bold"
                noOfLines={1}
                color={userNameColor}
                title={user.displayName || undefined}
              >
                {user.displayName || "Người dùng"}
              </Text>
              <Text
                fontSize="xs"
                noOfLines={1}
                color={userEmailColor}
                title={user.email || undefined}
              >
                {user.email || "Không có email"}
              </Text>
            </VStack>
          </HStack>
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={onLogout}
            w="full"
          >
            Đăng xuất
          </Button>
        </VStack>
      </PopoverContent>
    </Popover>
  );
};

const DesktopNav = ({ navItems }: { navItems: Array<NavItem> }) => {
  const linkColor = useColorModeValue("gray.600", "gray.300");
  const linkHoverColor = useColorModeValue("teal.600", "teal.300");
  const linkHoverBg = useColorModeValue("teal.50", "gray.700");
  const iconColor = useColorModeValue("gray.500", "gray.400");

  return (
    <HStack as="nav" spacing={{ base: 1, lg: 2 }} alignItems="center">
      {navItems.map((navItem) => (
        <Box key={navItem.label} position="relative">
          <Popover
            trigger="hover"
            placement="bottom-start"
            gutter={10}
            openDelay={50}
            closeDelay={150}
          >
            <PopoverTrigger>
              <ChakraLink
                as={
                  navItem.isExternal
                    ? "a"
                    : navItem.href === "#"
                    ? "div"
                    : NextLink
                }
                href={navItem.href === "#" ? undefined : navItem.href}
                target={navItem.isExternal ? "_blank" : undefined}
                rel={navItem.isExternal ? "noopener noreferrer" : undefined}
                p={3}
                fontSize="sm"
                fontWeight={500}
                color={linkColor}
                textTransform="capitalize"
                borderRadius="md"
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                  bg: linkHoverBg,
                }}
                display="flex"
                alignItems="center"
                cursor={
                  navItem.href === "#" || navItem.children || navItem.isExternal
                    ? "pointer"
                    : "default"
                }
              >
                {navItem.label}
                {navItem.children && (
                  <Icon
                    as={ChevronDownIcon}
                    w={4}
                    h={4}
                    ml={1.5}
                    color={iconColor}
                  />
                )}
              </ChakraLink>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow="xl"
                bg={useColorModeValue("white", "gray.800")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
                p={3}
                rounded="lg"
                minW="240px"
                zIndex="popover"
              >
                <VStack spacing={1} alignItems="stretch">
                  {navItem.children.map((child) => (
                    <DesktopSubNavItem key={child.label} {...child} />
                  ))}
                </VStack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </HStack>
  );
};

const DesktopSubNavItem = ({ label, subLabel, href, isExternal }: NavItem) => {
  const itemBgHover = useColorModeValue("teal.50", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const textHoverColor = useColorModeValue("teal.600", "teal.300");
  const iconColor = useColorModeValue("teal.500", "teal.300");

  let linkElement: React.ReactNode;
  const commonChakraProps = {
    as: "a" as "a",
    role: "group",
    display: "block",
    p: 3,
    rounded: "md",
    _hover: { bg: itemBgHover, textDecoration: "none" },
  };

  const content = (
    <HStack alignItems="center" spacing={3}>
      <Box flex="1">
        <Text
          fontWeight={500}
          color={textColor}
          transition="color 0.2s ease"
          _groupHover={{ color: textHoverColor }}
        >
          {label}
        </Text>
        {subLabel && (
          <Text fontSize="sm" color={subTextColor} mt={0.5} noOfLines={1}>
            {subLabel}
          </Text>
        )}
      </Box>
      <Flex
        transition="all .2s ease"
        transform="translateX(-5px)"
        opacity={0}
        _groupHover={{ opacity: 1, transform: "translateX(0)" }}
        justifyContent="center"
        alignItems="center"
      >
        <Icon color={iconColor} w={5} h={5} as={ChevronRightIcon} />
      </Flex>
    </HStack>
  );

  if (isExternal) {
    linkElement = (
      <ChakraLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...commonChakraProps}
      >
        {content}
      </ChakraLink>
    );
  } else {
    linkElement = (
      <NextLink href={href} passHref legacyBehavior>
        <ChakraLink {...commonChakraProps}>{content}</ChakraLink>
      </NextLink>
    );
  }
  return linkElement;
};

interface MobileNavProps {
  navItems: Array<NavItem>;
  onClose: () => void;
  user: FirebaseUser | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoadingUser: boolean;
}

const MobileNav = ({
  navItems,
  onClose,
  user,
  onLogin,
  onLogout,
  isLoadingUser,
}: MobileNavProps) => {
  const router = useRouter();

  const mobileNavBg = useColorModeValue("white", "gray.800");
  const mobileNavBorderColor = useColorModeValue("gray.200", "gray.700");
  const mobilePrimaryTextColor = useColorModeValue("black", "whiteAlpha.900");
  const mobileIconColor = useColorModeValue("black", "whiteAlpha.900");
  const mobileItemHoverBg = useColorModeValue("gray.100", "gray.700");
  const mobileLinkHoverTextColor = useColorModeValue("teal.600", "teal.300");
  const loginButtonBg = useColorModeValue("gray.200", "gray.600");
  const loginButtonHoverBg = useColorModeValue("gray.300", "gray.500");
  const logoutButtonHoverBg = useColorModeValue("red.50", "rgba(255,0,0,0.1)");
  const logoutButtonHoverTextColor = useColorModeValue("red.600", "red.300");

  const handleMobileNav = (href: string, isExternal?: boolean) => {
    if (isExternal) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
    onClose();
  };

  return (
    <Stack
      bg={mobileNavBg}
      p={4}
      display={{ md: "none" }}
      borderTop="1px"
      borderColor={mobileNavBorderColor}
      boxShadow="md"
      spacing={3}
      position="fixed"
      top="70px"
      left={0}
      right={0}
      zIndex="dropdown"
      maxH="calc(100vh - 70px)"
      overflowY="auto"
    >
      {navItems.map((navItem) => (
        <MobileNavItem
          key={navItem.label}
          {...navItem}
          onNavigate={handleMobileNav}
          baseLinkColor={mobilePrimaryTextColor}
          baseLinkHoverBg={mobileItemHoverBg}
          baseLinkHoverColor={mobileLinkHoverTextColor}
        />
      ))}

      <Box
        borderTopWidth="1px"
        borderColor={mobileNavBorderColor}
        pt={4}
        mt={2}
      >
        {isLoadingUser ? (
          <Button
            isLoading
            width="full"
            justifyContent="flex-start"
            variant="ghost"
            color={mobilePrimaryTextColor}
            aria-label="Đang tải"
          />
        ) : user ? (
          <VStack spacing={3} alignItems="stretch">
            <Flex
              alignItems="center"
              p={2}
              borderRadius="md"
              _hover={{ bg: mobileItemHoverBg }}
            >
              <Avatar
                size="sm"
                name={user.displayName || user.email || "User"}
                src={user.photoURL || undefined}
                mr={3}
              />
              <Text
                fontWeight="medium"
                color={mobilePrimaryTextColor}
                noOfLines={1}
              >
                {user.displayName || "Người dùng"}
              </Text>
            </Flex>
            <Button
              color={mobilePrimaryTextColor}
              variant="ghost"
              size="sm"
              onClick={() => {
                onLogout();
                onClose();
              }}
              w="full"
              justifyContent="flex-start"
              pl={2}
              _hover={{
                bg: logoutButtonHoverBg,
                color: logoutButtonHoverTextColor,
              }}
            >
              Đăng xuất
            </Button>
          </VStack>
        ) : (
          <Button
            onClick={() => {
              onLogin();
              onClose();
            }}
            bg={loginButtonBg}
            color={mobilePrimaryTextColor}
            _hover={{ bg: loginButtonHoverBg }}
            w="full"
            leftIcon={<EmailIcon color={mobileIconColor} />}
          >
            Đăng nhập với Google
          </Button>
        )}
      </Box>
    </Stack>
  );
};

interface MobileNavItemProps extends NavItem {
  onNavigate: (href: string, isExternal?: boolean) => void;
  baseLinkColor: string;
  baseLinkHoverBg: string;
  baseLinkHoverColor: string;
}

const MobileNavItem = ({
  label,
  children,
  href,
  isExternal,
  onNavigate,
  baseLinkColor,
  baseLinkHoverBg,
  baseLinkHoverColor,
}: MobileNavItemProps) => {
  const { isOpen, onToggle } = useDisclosure();
  // Correctly define subMenuBorderColor here using useColorModeValue
  const subMenuBorderColor = useColorModeValue("teal.200", "gray.600");

  const handleClick = () => {
    if (children) onToggle();
    else onNavigate(href, isExternal);
  };

  return (
    <Stack spacing={2} onClick={handleClick} role="group" w="full">
      <Flex
        as="button"
        py={3}
        px={2}
        justifyContent="space-between"
        alignItems="center"
        w="full"
        textAlign="left"
        borderRadius="md"
        bg="transparent"
        color={baseLinkColor} // Set base color for Flex, to be inherited by Icon
        _hover={{ bg: baseLinkHoverBg, color: baseLinkHoverColor }}
      >
        {/* MODIFIED: Explicitly set color on Text component */}
        <Text fontWeight={500} color={baseLinkColor}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition="transform 0.2s ease-in-out"
            transform={isOpen ? "rotate(180deg)" : ""}
            w={5}
            h={5}
            color="currentColor"
          />
        )}
      </Flex>
      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <VStack
          pl={6}
          borderLeft={2}
          borderStyle="solid"
          borderColor={subMenuBorderColor} // Use the defined subMenuBorderColor
          spacing={2}
          alignItems="stretch"
          mt={1}
        >
          {children &&
            children.map((child) => (
              <ChakraLink
                key={child.label}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(child.href, child.isExternal);
                }}
                py={2}
                px={2}
                w="full"
                textAlign="left"
                color={baseLinkColor}
                borderRadius="md"
                _hover={{
                  color: baseLinkHoverColor,
                  bg: baseLinkHoverBg,
                  textDecoration: "none",
                }}
              >
                {child.label}
              </ChakraLink>
            ))}
        </VStack>
      </Collapse>
    </Stack>
  );
};
