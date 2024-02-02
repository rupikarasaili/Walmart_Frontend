"use client";
import { backendClient } from "@/app/helpers/axios";
import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";

dayjs.extend(relativeTime);

interface IAudit {
  entity: string;
  description: string;
  createdAt: Date;
}

export const AuditTab = () => {
  const [audits, setAudits] = useState<Array<IAudit>>([]);
  const toast = useToast();

  const fetchAudits = async () => {
    try {
      const response = await backendClient.get("/audits");

      setAudits(response.data);
    } catch (error) {
      toast({
        title: "Failed to fetch audits",
        status: "error",
      });
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  return (
    <TableContainer width={"100%"}>
      <Button
        justifySelf={"flex-end"}
        mb={5}
        colorScheme="orange"
        onClick={fetchAudits}
      >
        Refresh
      </Button>
      <Table variant="striped" colorScheme="orange">
        {" "}
        <Thead>
          <Tr>
            <Th>Entity</Th>
            <Th>Description</Th>
            <Th>Created At</Th>
          </Tr>
        </Thead>
        <Tbody>
          {audits.map((audit) => (
            <Tr>
              <Td>{audit.entity}</Td>
              <Td>
                <Tooltip label={audit.description}>
                  <Text isTruncated noOfLines={1}>
                    {audit.description}
                  </Text>
                </Tooltip>
              </Td>
              <Td>{dayjs(audit.createdAt).fromNow()}</Td>
            </Tr>
          ))}
          {audits.length === 0 && <Tr>No items found, create a new audit!</Tr>}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
