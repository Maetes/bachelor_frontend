import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react';

export const TableWrapper = ({
  data,
  heading = null,
  itemSelected = () => null,
  bounceBackData = () => null,
  clickable = false,
}: {
  data: any[];
  heading?: string | null;
  itemSelected?: React.Dispatch<React.SetStateAction<boolean>>;
  bounceBackData?: React.Dispatch<React.SetStateAction<any>>;
  clickable?: boolean;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSelect = (i: number) => (e: any) => {
    bounceBackData(i);
    onOpen();
  };

  return (
    <>
      {data[0] === 'default' && 'No input yet'}
      {data[0] !== 'default' && (
        <Table variant='simple' size='sm'>
          {heading && <TableCaption>{heading}</TableCaption>}
          <Thead>
            <Tr>
              {Object.keys(data[0]).map((e, i) => {
                return <Th key={i}>{e}</Th>;
              })}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((e, i) => {
              return (
                <Tr
                  key={i}
                  onClick={handleSelect(i)}
                  _hover={{ background: 'cyan.50', cursor: 'pointer' }}
                  _focus={{
                    background: 'cyan.100',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  tabIndex={1}
                >
                  {Object.values(e).map((f: any, g) => (
                    <Td key={g} isNumeric>
                      {f !== null ? f.toString() : ''}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              {Object.keys(data[0]).map((e, i) => {
                return <Th key={i}>{e}</Th>;
              })}
            </Tr>
          </Tfoot>
        </Table>
      )}
      {itemSelected && clickable && (
        <Modal onClose={onClose} size={'xs'} isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Auswahl anzeigen?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Möchten Sie die aktuell ausgewählten Itemwerte anzeigen?
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme='cyan'
                mr={3}
                onClick={() => itemSelected(true)}
              >
                Ok
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  itemSelected(false);
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
