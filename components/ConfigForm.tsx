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

const daten = [
  'Beispieldatenset',
  'Rewe_Ausgangsbasis',
  'Aldi_eineFiliale',
  'Rewe_eineFiliale',
];

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
  const [support, setSupport] = useState('0.001');
  const [confidence, setConfidence] = useState('0');
  const [startTracker, setStartTracker] = useState(false);
  const [changeButton, setChangeButton] = useState(false);
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
    setStateGlobal({ type: 'DELETE', payload: '' });
    setFetch(true);
    setTrack(true);
    setChangeButton(true);
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
      setChangeButton(false);
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
      setChangeButton(false);
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
            disabled={changeButton}
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
            disabled={changeButton}
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
            min={0.001}
            step={0.01}
            onChange={handleInputChange('support')}
            value={support}
            disabled={changeButton}
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
            disabled={changeButton}
          >
            <NumberInputField placeholder='Setze Konfidenz' />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>Optional</FormHelperText>
        </FormControl>
        {ergebnisState.ergebnis.start.freqItems.cpu[0] === 0 && (
          <Button
            type='submit'
            colorScheme='cyan'
            size='lg'
            fontSize='md'
            color='white'
            isLoading={changeButton}
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
        {ergebnisState.ergebnis.start.freqItems.cpu[0] !== 0 &&
          !isError.status && (
            <Button
              type='button'
              colorScheme='cyan'
              color='white'
              size='lg'
              fontSize='md'
              isLoading={changeButton}
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
