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
import { useCheckrunning } from './useCheckrunning';
import { useResult } from './useResult';

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
  const [startTracker, setStartTracker] = useState(false);
  const toast = useToast();

  const router = useRouter();
  const [{ ergebnisState }, setStateGlobal] = useStateGlobal();

  let [{ data: jobid }, setFetch] = useAlgorithm({
    daten: datenset,
    algorithm: algos[algorithm],
    support: support,
    confidence: confidence,
    // cache: progress ? false : true,
  });
  const [{ result: data, isError }, setGet, setIsError] = useResult({ jobid });
  const [{ isLoading }, setTrack] = useCheckrunning({ jobid });

  const handleSelectChange =
    (kind: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (kind === 'data') {
        setDatenset(e.target.value);
        jobid = '';
      } else if (kind === 'algo') {
        setAlgorithm(e.target.value as asd<typeof algos>);
        jobid = '';
      }
    };

  const handleInputChange = (kind: string) => (e: string) => {
    if (kind === 'support') {
      setSupport(e);
      jobid = '';
    } else if (kind === 'confidence') {
      setConfidence(e);
      jobid = '';
    }
  };

  const handleSubmit = () => {
    setFetch(true);
    setTrack(true);
  };

  useEffect(() => {
    if (jobid) {
      setFetch(false);
      console.log(jobid);
    }
  }, [jobid, setFetch]);

  useEffect(() => {
    if (!isLoading && jobid && !isError.status && startTracker) {
      setGet(true);
      setStartTracker(false);
    }
  }, [isError.status, isLoading, jobid, setGet, startTracker]);

  useEffect(() => {
    if (data || isError.status) {
      setGet(false);
    }
  }, [data, isError.status, setGet]);

  useEffect(() => {
    if (isLoading) {
      setStartTracker(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      setStateGlobal({ type: 'CREATE', payload: data });
      setGet(false);
      setTrack(false);
    }
  }, [data, setGet, setStateGlobal, setTrack]);

  useEffect(() => {
    if (isError.status) {
      toast({
        title: `${isError.message}`,
        duration: 3000,
        position: 'top',
        isClosable: true,
        status: 'error',
      });
      setIsError({ status: false, message: '' });
    }
  }, [isError, setIsError, toast]);

  return (
    <chakra.form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
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
            onChange={handleInputChange('support')}
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
            onChange={handleInputChange('confidence')}
          >
            <NumberInputField placeholder='Setze Konfidenz' />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>Optional</FormHelperText>
        </FormControl>
        {(!data || isError.status) && (
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
        {data && !isError.status && (
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
