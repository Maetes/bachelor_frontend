import {
  Text,
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
  IconButton,
  Tooltip,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@chakra-ui/icons';
import React, { useEffect } from 'react';
import { useTable, usePagination } from 'react-table';

export const TableWrapper = ({
  data,
  heading = null,
  itemSelected = () => null,
  bounceBackData = () => null,
  clickable = false,
  loadingItem = false,
  uxPagesetter = () => null,
  uxPage = 0,
}: {
  data: any[];
  heading?: string | null;
  itemSelected?: React.Dispatch<React.SetStateAction<boolean>>;
  bounceBackData?: React.Dispatch<React.SetStateAction<any>>;
  clickable?: boolean;
  loadingItem?: boolean;
  uxPagesetter?: React.Dispatch<React.SetStateAction<any>>;
  uxPage?: number;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const stringer = (row: string) => (e: any) =>
    Array.isArray(e[row]) && e[row].length ? e[row].join() : e[row];

  const columns = React.useMemo(
    () =>
      Object.keys(data[0]).map((e, i) => {
        return {
          Header: e,
          accessor: stringer(e),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data2 = React.useMemo(() => data, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
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
      data: data2,
      initialState: { pageIndex: uxPage, pageSize: 20 },
    },
    usePagination
  );

  const handleSelect = (i: number) => (e: any) => {
    bounceBackData(i + pageIndex * pageSize);
    onOpen();
  };

  useEffect(() => {
    uxPagesetter({ type: 'HISTPAGE', payload: pageIndex });
  }, [pageIndex, uxPagesetter]);

  return (
    <>
      {data[0] === 'default' && 'No input yet'}
      {data[0] !== 'default' && (
        <>
          <Table variant='simple' size='sm' {...getTableProps()}>
            {heading && <TableCaption>{heading}</TableCaption>}
            <Thead>
              {headerGroups.map((headerGroup, i) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={i}>
                  {headerGroup.headers.map((column, j) => (
                    <Th {...column.getHeaderProps()} key={j}>
                      {column.render('Header')}
                    </Th>
                  ))}
                </Tr>
              ))}
              {/* <Tr>
              {Object.keys(data[0]).map((e, i) => {
                return <Th key={i}>{e}</Th>;
              })}
            </Tr> */}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row, k) => {
                prepareRow(row);
                return (
                  <Tr
                    {...row.getRowProps()}
                    key={k}
                    onClick={handleSelect(k)}
                    _hover={{ background: 'cyan.50', cursor: 'pointer' }}
                    _focus={{
                      background: 'cyan.100',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                    tabIndex={1}
                  >
                    {row.cells.map((cell, l) => {
                      return (
                        <Td {...cell.getCellProps()} key={l}>
                          {cell.render('Cell')}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}

              {/* {data.map((e, i) => {
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
            })} */}
            </Tbody>
            <Tfoot>
              <Tr>
                {Object.keys(data[0]).map((e, i) => {
                  return <Th key={i}>{e}</Th>;
                })}
              </Tr>
            </Tfoot>
          </Table>

          <Flex justifyContent='space-between' m={4} alignItems='center'>
            <Flex>
              <Tooltip label='First Page'>
                <IconButton
                  aria-label='first apge'
                  onClick={() => gotoPage(0)}
                  isDisabled={!canPreviousPage}
                  icon={<ArrowLeftIcon h={3} w={3} />}
                  mr={4}
                />
              </Tooltip>
              <Tooltip label='Previous Page'>
                <IconButton
                  aria-label='prev page'
                  onClick={previousPage}
                  isDisabled={!canPreviousPage}
                  icon={<ChevronLeftIcon h={6} w={6} />}
                />
              </Tooltip>
            </Flex>

            <Flex alignItems='center'>
              <Text flexShrink={0} mr={8}>
                Page{' '}
                <Text fontWeight='bold' as='span'>
                  {pageIndex + 1}
                </Text>{' '}
                of{' '}
                <Text fontWeight='bold' as='span'>
                  {pageOptions.length}
                </Text>
              </Text>
              <Text flexShrink={0}>Go to page:</Text>{' '}
              <NumberInput
                ml={2}
                mr={8}
                w={28}
                min={1}
                max={pageOptions.length}
                onChange={(value) => {
                  const page = Number(value) ? Number(value) - 1 : 0;
                  gotoPage(page);
                }}
                defaultValue={pageIndex + 1}
                value={pageIndex + 1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
            <Flex>
              <Tooltip label='Next Page'>
                <IconButton
                  aria-label='next page'
                  onClick={nextPage}
                  isDisabled={!canNextPage}
                  icon={<ChevronRightIcon h={6} w={6} />}
                />
              </Tooltip>
              <Tooltip label='Last Page'>
                <IconButton
                  aria-label='last page'
                  onClick={() => gotoPage(pageCount - 1)}
                  isDisabled={!canNextPage}
                  icon={<ArrowRightIcon h={3} w={3} />}
                  ml={4}
                />
              </Tooltip>
            </Flex>
          </Flex>
        </>
      )}
      {itemSelected && clickable && (
        <Modal
          onClose={onClose}
          size={'xs'}
          isOpen={isOpen}
          closeOnEsc={!loadingItem}
          closeOnOverlayClick={!loadingItem}
        >
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
                disabled={loadingItem}
                isLoading={loadingItem}
              >
                Ok
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  itemSelected(false);
                }}
                disabled={loadingItem}
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
