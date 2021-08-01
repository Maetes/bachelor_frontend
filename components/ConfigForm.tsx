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
import { ergebnisInitialState } from '../stateManagement/reduceers/ergebnisReducer';
import { useStateGlobal } from '../stateManagement/useStateGlobal';
import { useCheckrunning } from './useCheckrunning';
import { useResult } from './useResult';

type asd<T> = keyof T;

const daten = [
  'Beispieldatenset',
  'Rewe_Ausgangsbasis',
  'Rewe_Ausgangsbasis',
  'Aldi_Ausgangsbasis',
  'Aldi_Transaktionen',
  'Rewe_Transaktionen',
  'Aldi_Warenkorb',
  'Rewe_Warenkorb',
  'Aldi_häufigeItemsets',
  'Rewe_häufigeItemsets',
  'Aldi_Items',
  'Rewe_Items',
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
  const [changeButton, setChangeButton] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
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
    setLoadingState(true);
    setFetch(true);
    setChangeButton(true);
  };

  useEffect(() => {
    if (jobid) {
      setFetch(false);
      setTrack(true);
    }
  }, [jobid, setFetch, setTrack]);

  useEffect(() => {
    if (!isLoading && jobid && !isError.status) {
      console.log(isLoading, jobid);
      setGet(true);
      setTrack(false);
    }
  }, [isError.status, isLoading, jobid, setGet, setTrack]);

  useEffect(() => {
    if (data && !isError.status) {
      setGet(false);
      setStateGlobal({ type: 'CREATE', payload: data });
      setLoadingState(false);
    }
  }, [data, isError.status, setGet, setStateGlobal]);

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
        {!changeButton && (
          <Button
            type='submit'
            colorScheme='cyan'
            size='lg'
            fontSize='md'
            color='white'
            isDisabled={changeButton}
          >
            Auswerten
          </Button>
        )}
        {changeButton && !isError.status && (
          <Button
            type='button'
            colorScheme='cyan'
            color='white'
            size='lg'
            fontSize='md'
            isLoading={loadingState}
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
