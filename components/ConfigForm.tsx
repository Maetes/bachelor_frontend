import {
  Button,
  chakra,
  FormControl,
  FormHelperText,
  FormLabel,
  HTMLChakraProps,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAlgorithm } from '../components/useAlgorithm';
import { useStateGlobal } from '../stateManagement/useStateGlobal';

type asd<T> = keyof T;

const daten = ['klein', 'test', 'Aldi', 'Rewe'];

const algos = {
  Apriori: 'apriori',
  Eclat: 'eclat',
  'FP-Growth': 'fpgrowth',
};

export const ConfigForm = (props: HTMLChakraProps<'form'>) => {
  const [algorithm, setAlgorithm] = useState<asd<typeof algos>>(
    '' as 'Apriori'
  );
  const [datenset, setDatenset] = useState<string>('');
  const [support, setSupport] = useState('0.01');
  const [confidence, setConfidence] = useState('0');
  const toast = useToast();

  const router = useRouter();
  const [{ ergebnisState }, setStateGlobal] = useStateGlobal();

  const handleSelectChange =
    (kind: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (kind === 'data') {
        setDatenset(e.target.value);
      } else if (kind === 'algo') {
        setAlgorithm(e.target.value as asd<typeof algos>);
      }
    };

  const [{ data, isError, isLoading }, setFetch] = useAlgorithm({
    daten: datenset,
    algorithm: algos[algorithm],
    support: support,
    confidence: confidence,
    // cache: progress ? false : true,
  });

  const handleSubmit = () => {
    setFetch(true);
  };

  useEffect(() => {
    setFetch(false);
    if (typeof data === 'string' && isLoading === false) {
      console.log('ok');
      toast({
        title: `${data}`,
        duration: 3000,
        position: 'top',
        isClosable: true,
        status: 'error',
      });
    } else {
      setStateGlobal({ type: 'CREATE', payload: data });
    }
  }, [data, setFetch, setStateGlobal, toast, isLoading]);

  return (
    <chakra.form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
        setFetch(true);
      }}
      {...props}
    >
      <Stack spacing='6'>
        <FormControl id='algorithmus' isRequired>
          <FormLabel>Algorithmus</FormLabel>
          <Select
            placeholder='Wähle Algorithmus'
            value={algorithm}
            onChange={handleSelectChange('algo')}
          >
            {Object.keys(algos).map((e, i) => {
              return <option key={i}>{e}</option>;
            })}
          </Select>
        </FormControl>
        <FormControl id='Datenset' isRequired>
          <FormLabel>Daten</FormLabel>
          <Select
            placeholder='Wähle Datenset'
            value={datenset}
            onChange={handleSelectChange('data')}
          >
            {daten.map((e, i) => (
              <option key={i}>{e}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl id='support' isRequired>
          <FormLabel>Support</FormLabel>
          <NumberInput
            max={1}
            min={0.01}
            step={0.01}
            onChange={(e) => setSupport(e)}
            value={support}
          >
            <NumberInputField placeholder='Setze relativen Support' />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl id='confidence'>
          <FormLabel>Konfidenz</FormLabel>
          <NumberInput
            max={1}
            min={0}
            step={0.01}
            value={confidence}
            onChange={(e) => setConfidence(e)}
          >
            <NumberInputField placeholder='Setze Konfidenz' />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>Optional</FormHelperText>
        </FormControl>
        {(!data || typeof data === 'string') && (
          <Button
            type='submit'
            colorScheme='cyan'
            size='lg'
            fontSize='md'
            color='white'
            isLoading={isLoading}
            isDisabled={
              algorithm === ('' as 'Apriori')
                ? true
                : datenset === ''
                ? true
                : false
            }
          >
            Auswerten
          </Button>
        )}
        {data && typeof data !== 'string' && (
          <Button
            type='button'
            colorScheme='cyan'
            color='white'
            size='lg'
            fontSize='md'
            onClick={() => {
              router.push({
                pathname: '/ergebnis',
                query: {
                  d: datenset,
                  a: algos[algorithm],
                  s: support,
                  ...(confidence !== '0' && { c: confidence }),
                },
              });
            }}
          >
            Ergebnis
          </Button>
        )}
      </Stack>
    </chakra.form>
  );
};
