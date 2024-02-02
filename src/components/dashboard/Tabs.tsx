import {
  Flex,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { AuditTab } from "./Tabs/Audits";
import { CategoryTab } from "./Tabs/Category";
import { ProductTab } from "./Tabs/Product";

export const Sidebar = () => {
  return (
    <Flex padding={10} py={2} width={"100%"}>
      <Tabs variant="soft-rounded" colorScheme="orange" width={"100%"}>
        <TabList>
          {["Categories", "Products", "Audits"].map((item) => (
            <Tab>{item}</Tab>
          ))}
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
        <TabPanels width={"100%"}>
          <TabPanel width={"100%"}>
            <CategoryTab />
          </TabPanel>

          <TabPanel width={"100%"}>
            <ProductTab />
          </TabPanel>

          <TabPanel width={"100%"}>
            <AuditTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
