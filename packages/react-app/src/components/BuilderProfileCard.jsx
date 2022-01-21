import React, { useEffect, useState } from "react";
import { Link as RouteLink } from "react-router-dom";
import { useUserAddress } from "eth-hooks";
import {
  Button,
  Flex,
  Center,
  Divider,
  Text,
  Link,
  Skeleton,
  SkeletonText,
  Alert,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Modal,
  FormControl,
  FormLabel,
  Input,
  useToast,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import QRPunkBlockie from "./QrPunkBlockie";
import SocialLink from "./SocialLink";
import useDisplayAddress from "../hooks/useDisplayAddress";
import useCustomColorModes from "../hooks/useCustomColorModes";
import { ellipsizedAddress } from "../helpers/strings";
import {
  getUpdateReachedOutFlagSignMessage,
  getUpdateSocialsSignMessage,
  postUpdateReachedOutFlag,
  postUpdateSocials,
} from "../data/api";
import { bySocialWeight, socials } from "../data/socials";
import { USER_ROLES } from "../helpers/constants";

const BuilderProfileCardSkeleton = ({ isLoaded, children }) => (
  <Skeleton isLoaded={isLoaded}>{isLoaded ? children() : <SkeletonText mt="4" noOfLines={4} spacing="4" />}</Skeleton>
);

const BuilderProfileCard = ({ builder, mainnetProvider, isMyProfile, userProvider, fetchBuilder, userRole }) => {
  const address = useUserAddress(userProvider);
  const ens = useDisplayAddress(mainnetProvider, builder?.id);
  const [updatedSocials, setUpdatedSocials] = useState({});
  const [isUpdatingReachedOutFlag, setIsUpdatingReachedOutFlag] = useState(false);
  const [isUpdatingSocials, setIsUpdatingSocials] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { borderColor, secondaryFontColor } = useCustomColorModes();
  const shortAddress = ellipsizedAddress(builder?.id);
  const hasEns = ens !== shortAddress;

  const toast = useToast({ position: "top", isClosable: true });
  const toastVariant = useColorModeValue("subtle", "solid");

  const joinedDate = new Date(builder?.creationTimestamp);
  const joinedDateDisplay = joinedDate.toLocaleString("default", { month: "long" }) + " " + joinedDate.getFullYear();

  // INFO: conditional chaining and coalescing didn't work when also checking the length
  const hasProfileLinks = builder?.socialLinks ? Object.keys(builder.socialLinks).length !== 0 : false;

  const isAdmin = userRole === USER_ROLES.admin;

  useEffect(() => {
    if (builder) {
      setUpdatedSocials(builder.socialLinks ?? {});
    }
  }, [builder]);

  const handleUpdateSocials = async () => {
    setIsUpdatingSocials(true);

    // Avoid sending socials with empty strings.
    const socialLinkCleaned = Object.fromEntries(Object.entries(updatedSocials).filter(([_, value]) => !!value));

    let signMessage;
    try {
      signMessage = await getUpdateSocialsSignMessage(address);
    } catch (error) {
      toast({
        description: " Sorry, the server is overloaded. 🧯🚒🔥",
        status: "error",
        variant: toastVariant,
      });
      setIsUpdatingSocials(false);
      return;
    }

    let signature;
    try {
      signature = await userProvider.send("personal_sign", [signMessage, address]);
    } catch (error) {
      toast({
        description: "Couldn't get a signature from the Wallet",
        status: "error",
        variant: toastVariant,
      });
      setIsUpdatingSocials(false);
      return;
    }

    try {
      await postUpdateSocials(address, signature, socialLinkCleaned);
    } catch (error) {
      if (error.status === 401) {
        toast({
          status: "error",
          description: "Access error",
          variant: toastVariant,
        });
        setIsUpdatingSocials(false);
        return;
      }
      toast({
        status: "error",
        description: "Can't update your socials. Please try again.",
        variant: toastVariant,
      });
      setIsUpdatingSocials(false);
      return;
    }

    toast({
      description: "Your social links have been updated",
      status: "success",
      variant: toastVariant,
    });
    fetchBuilder();
    setIsUpdatingSocials(false);
    onClose();
  };

  const handleUpdateReachedOutFlag = async reachedOut => {
    setIsUpdatingReachedOutFlag(true);

    let signMessage;
    try {
      signMessage = await getUpdateReachedOutFlagSignMessage(builder.id, reachedOut);
    } catch (error) {
      toast({
        description: " Sorry, the server is overloaded. 🧯🚒🔥",
        status: "error",
        variant: toastVariant,
      });
      setIsUpdatingReachedOutFlag(false);
      return;
    }

    let signature;
    try {
      signature = await userProvider.send("personal_sign", [signMessage, address]);
    } catch (error) {
      toast({
        description: "Couldn't get a signature from the Wallet",
        status: "error",
        variant: toastVariant,
      });
      setIsUpdatingReachedOutFlag(false);
      return;
    }

    try {
      await postUpdateReachedOutFlag(address, builder.id, reachedOut, signature);
    } catch (error) {
      if (error.status === 401) {
        toast({
          status: "error",
          description: "Access error",
          variant: toastVariant,
        });
        setIsUpdatingReachedOutFlag(false);
        return;
      }
      toast({
        status: "error",
        description: "Can't update the reached out flag. Please try again.",
        variant: toastVariant,
      });
      setIsUpdatingReachedOutFlag(false);
      return;
    }

    toast({
      description: 'Updated "reached out" flag successfully',
      status: "success",
      variant: toastVariant,
    });
    fetchBuilder();
    setIsUpdatingReachedOutFlag(false);
  };

  return (
    <>
      <BuilderProfileCardSkeleton isLoaded={!!builder}>
        {() => (
          /* delay execution */
          <Flex
            borderRadius="lg"
            borderColor={borderColor}
            borderWidth={1}
            justify={{ base: "space-around", xl: "center" }}
            direction={{ base: "row", xl: "column" }}
            p={4}
            pb={6}
            maxW={{ base: "full", lg: "50%", xl: 60 }}
            margin="auto"
          >
            <Link as={RouteLink} to={`/builders/${builder.id}`}>
              <QRPunkBlockie
                withQr={false}
                address={builder.id?.toLowerCase()}
                w={52}
                borderRadius="lg"
                margin="auto"
              />
            </Link>
            <Flex alignContent="center" direction="column" mt={4}>
              {hasEns ? (
                <>
                  <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                    {ens}
                  </Text>
                  <Text textAlign="center" mb={4} color={secondaryFontColor}>
                    {shortAddress}
                  </Text>
                </>
              ) : (
                <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={8}>
                  {shortAddress}
                </Text>
              )}
              {isAdmin && (
                <Center mb={4}>
                  {builder.reachedOut ? (
                    <Badge variant="outline" colorScheme="green" alignSelf="center">
                      Reached Out
                    </Badge>
                  ) : (
                    <Button
                      colorScheme="green"
                      size="xs"
                      onClick={() => handleUpdateReachedOutFlag(true)}
                      isLoading={isUpdatingReachedOutFlag}
                      alignSelf="center"
                    >
                      Mark as reached out
                    </Button>
                  )}
                </Center>
              )}
              <Divider mb={6} />
              {hasProfileLinks ? (
                <Flex mb={4} justifyContent="space-evenly" alignItems="center">
                  {Object.entries(builder.socialLinks)
                    .sort(bySocialWeight)
                    .map(([socialId, socialValue]) => (
                      <SocialLink id={socialId} value={socialValue} />
                    ))}
                </Flex>
              ) : (
                isMyProfile && (
                  <Alert mb={3} status="warning">
                    <Text fontSize="xs">You haven't set your socials yet</Text>
                  </Alert>
                )
              )}
              {isMyProfile && (
                <Button mb={3} size="xs" variant="outline" onClick={onOpen}>
                  Update socials
                </Button>
              )}
              <Text textAlign="center" color={secondaryFontColor}>
                Joined {joinedDateDisplay}
              </Text>
            </Flex>
          </Flex>
        )}
      </BuilderProfileCardSkeleton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update your socials</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            {Object.entries(socials).map(([socialId, socialData]) => (
              <FormControl id="socialId" key={socialId} mb={3}>
                <FormLabel htmlFor={socialId} mb={0}>
                  <strong>{socialData.label}:</strong>
                </FormLabel>
                <Input
                  type="text"
                  name={socialId}
                  value={updatedSocials[socialId] ?? ""}
                  placeholder={socialData.placeholder}
                  onChange={e => {
                    const value = e.target.value;
                    setUpdatedSocials(prevSocials => ({
                      ...prevSocials,
                      [socialId]: value,
                    }));
                  }}
                />
              </FormControl>
            ))}
            <Button colorScheme="blue" onClick={handleUpdateSocials} isLoading={isUpdatingSocials} isFullWidth mt={4}>
              Update
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BuilderProfileCard;
