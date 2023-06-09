import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { server } from "../index"
import { Container, HStack, Button, RadioGroup, Radio } from '@chakra-ui/react';
import Loader from "./Loader";
import ErrorComponent from './ErrorComponent';
import CoinCard from './CoinCard';
import { Input } from '@chakra-ui/react';

const Coins = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("inr");
  const [counter, setCounter] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const currencySymbol = currency === "inr" ? "₹" : currency === "eur" ? "€" : "$"

  const changePage = (page) => {
    setPage(page);
    setLoading(true);
  };

  const btns = new Array(132).fill(1);
  


  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(`${server}/coins/markets?vs_currency=${currency}&page=${page}`);
        setCoins(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    
    fetchCoins();
  }, [currency, page, counter]);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(seconds => seconds + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  if (error)
    return <ErrorComponent message={"Error While Fetching Coins"} />;

  return (
    <Container maxW={"container.xl"}>
      {loading ? (
        <Loader />
      ) : (
        <>

          <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
            <HStack spacing={"4"}>
              <Radio value={'inr'}>INR</Radio>
              <Radio value={'usd'}>USD</Radio>
              <Radio value={'eur'}>EUR</Radio>
            </HStack>
          </RadioGroup>

          <Input
          marginLeft={"15px"}
          box-width={"98px"}
            type="text"
            placeholder="Search coins..."
            value={searchQuery}
            onChange={handleSearch}
            p={'8'}
          />
          <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
            {filteredCoins.map((i) => (
              <CoinCard
                id={i.id}
                key={i.id}
                name={i.name}
                price={i.current_price}
                img={i.image}
                symbol={i.symbol}
                currencySymbol={currencySymbol}
              />
            ))}
            
          </HStack>

          <HStack w={"full"} overflowX={"auto"} p={"8"}>

            {
              btns.map((item, index) => (
                <Button
                  key={index}
                  backgroundColor={'blackAlpha.900'}
                  color={"white"}
                  onClick={() => changePage(index + 1)}>

                  {index + 1}
                </Button>
              ))
            }

          </HStack>

        </>
        //test
      )}
    </Container>
  );
};



export default Coins;
