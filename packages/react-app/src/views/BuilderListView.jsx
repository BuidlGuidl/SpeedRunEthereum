import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Center,
  Container,
  Heading,
  Link,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Flex,
} from "@chakra-ui/react";
import useCustomColorModes from "../hooks/useCustomColorModes";
import BuilderListSkeleton from "../components/skeletons/BuilderListSkeleton";
import { useTable, usePagination, useSortBy } from "react-table";
import DateWithTooltip from "../components/DateWithTooltip";
import SocialLink from "../components/SocialLink";
import { getAcceptedChallenges } from "../helpers/builders";
import { Link as RouteLink } from "react-router-dom";
import Address from "../components/Address";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

const serverPath = "/builders";

const builderLastActivity = builder => {
  const lastChallengeUpdated = Object.values(builder?.challenges ?? {})
    .map(challenge => challenge.submittedTimestamp)
    .sort((t1, t2) => t2 - t1)?.[0];

  return lastChallengeUpdated ?? builder?.creationTimestamp;
};

const BuilderSocialLinksCell = ({ builder }) => {
  const hasProfileLinks = builder?.socialLinks ? Object.keys(builder.socialLinks).length !== 0 : false;

  if (!hasProfileLinks) return "-";

  return (
    <Flex justifyContent="space-evenly" alignItems="center">
      {Object.entries(builder.socialLinks).map(([socialId, socialValue]) => (
        <SocialLink id={socialId} value={socialValue} />
      ))}
    </Flex>
  );
};

const BuilderAddressCell = ({ builder, mainnetProvider }) => {
  return (
    <Link as={RouteLink} to={`/builders/${builder.id}`} pos="relative">
      <Address address={builder.id} ensProvider={mainnetProvider} w="12.5" fontSize="16" />
    </Link>
  );
};

export default function BuilderListView({ serverUrl, mainnetProvider }) {
  const [builders, setBuilders] = useState([]);
  const [isLoadingBuilders, setIsLoadingBuilders] = useState(false);
  const { secondaryFontColor } = useCustomColorModes();

  const columns = useMemo(
    () => [
      {
        Header: "Builder",
        accessor: "builder",
        disableSortBy: true,
      },
      {
        Header: "Challenges",
        accessor: "challenges",
        sortDescFirst: true,
      },
      {
        Header: "Socials",
        accessor: "socials",
        disableSortBy: true,
      },
      {
        Header: "Last Activity",
        accessor: "lastActivity",
        disableSortBy: true,
      },
    ],
    [],
  );

  useEffect(() => {
    async function fetchBuilders() {
      setIsLoadingBuilders(true);
      const fetchedBuilders = await axios.get(serverUrl + serverPath);

      const processedBuilders = fetchedBuilders.data.map(builder => ({
        builder: <BuilderAddressCell builder={builder} mainnetProvider={mainnetProvider} />,
        challenges: getAcceptedChallenges(builder?.challenges)?.length ?? 0,
        socials: <BuilderSocialLinksCell builder={builder} />,
        lastActivity: <DateWithTooltip timestamp={builderLastActivity(builder)} />,
      }));

      setBuilders(processedBuilders);
      setIsLoadingBuilders(false);
    }

    fetchBuilders();
    // eslint-disable-next-line
  }, [serverUrl]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: builders,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination,
  );

  return (
    <Container maxW="container.lg">
      <Container maxW="container.md" centerContent>
        <Heading as="h1" mb="4">
          All Builders
        </Heading>
        <Text color={secondaryFontColor} textAlign="center">
          List of Ethereum builders creating products, prototypes, and tutorials with{" "}
          <Link href="https://github.com/scaffold-eth/scaffold-eth" color="teal.500" isExternal>
            scaffold-eth
          </Link>
          .
        </Text>
        <Text color={secondaryFontColor} mb="10">
          You can fund Eth development sending Eth to any stream.
        </Text>
      </Container>
      {isLoadingBuilders ? (
        <BuilderListSkeleton />
      ) : (
        <Box overflowX="auto">
          <Center mb={5}>
            <chakra.strong mr={2}>Total builders:</chakra.strong> {builders.length}
          </Center>
          <Table {...getTableProps()}>
            <Thead>
              {headerGroups.map(headerGroup => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render("Header")}
                      <chakra.span pl="4">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <TriangleDownIcon aria-label="sorted descending" />
                          ) : (
                            <TriangleUpIcon aria-label="sorted ascending" />
                          )
                        ) : null}
                      </chakra.span>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <Td {...cell.getCellProps()}>{cell.value}</Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>

          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>{" "}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {"<"}
            </button>{" "}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {">"}
            </button>{" "}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {">>"}
            </button>{" "}
            <span>
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
            <span>
              | Go to page:{" "}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: "100px" }}
              />
            </span>{" "}
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </Box>
      )}
    </Container>
  );
}
