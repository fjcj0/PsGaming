'use client';
import { useState, useEffect } from 'react';
import BarChartCountry from "./components/barchartcountry";
import CardInfo from "./components/cardinfo";
import LineChartComponent from "./components/linechart";
import Loading from './_components/loading';
import PieChart from './components/piechart';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Report from './components/report';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [TotalTrailers, setTotalTrailers] = useState(0);
  const [TotalUsers, setTotalUsers] = useState(0);
  const [avgRate, setAvgRate] = useState(0);
  const [topFiveGames, setTopFiveGames] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [countryCount, setCountryCount] = useState([]);
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      setCountries(data);
    };
    fetchCountries();
  }, []);
  useEffect(() => {
    const GetTotalReports = async () => {
      const collectionRef = collection(db, 'reports');
      const querySnapshot = await getDocs(collectionRef);
      if (!querySnapshot.empty) {
        return querySnapshot.size;
      }
      return 0;
    };
    setTotalReports(GetTotalReports());
  }, []);
  useEffect(() => {
    const GetTotalTrailers = async () => {
      const collectionRef = collection(db, 'games');
      const querySnapshot = await getDocs(collectionRef);
      if (!querySnapshot.empty) {
        return querySnapshot.size;
      }
      return 0;
    };
    setTotalTrailers(GetTotalTrailers());
  }, []);
  useEffect(() => {
    const GetTotalUsers = async () => {
      const collectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(collectionRef);
      if (!querySnapshot.empty) {
        return querySnapshot.size;
      }
      return 0;
    };
    setTotalUsers(GetTotalUsers());
  }, []);
  const getTopCountries = async () => {
    try {
      const profilesSnapshot = await getDocs(collection(db, "profiles"));
      const countryCount = {};
      profilesSnapshot.forEach((doc) => {
        const userCountry = doc.data().country;
        if (userCountry) {
          countryCount[userCountry] = (countryCount[userCountry] || 0) + 1;
        }
      });
      const countryArray = Object.entries(countryCount);
      const sortedCountryArray = countryArray
        .sort(([countryA], [countryB]) => {
          const countryAData = countries.find(country => country.cca3 === countryA);
          const countryBData = countries.find(country => country.cca3 === countryB);
          const countryAName = countryAData ? countryAData.name.common : countryA;
          const countryBName = countryBData ? countryBData.name.common : countryB;
          return countryAName.localeCompare(countryBName);
        })
        .slice(0, 6);
      const topCountryDetails = sortedCountryArray.map(([countryCode, count]) => {
        const countryData = countries.find(country => country.cca3 === countryCode);
        return {
          name: countryData ? countryData.name.common : countryCode,
          count
        };
      });
      return topCountryDetails;
    } catch (error) {
      console.log("Error fetching top countries:", error.message);
    }
  };
  useEffect(() => {
    const fetchTopCountries = async () => {
      const topCountries = await getTopCountries();
      setCountryCount(topCountries);
    };
    fetchTopCountries();
  }, []);
  useEffect(() => {
    const getAvgRate = async () => {
      try {
        const gamesRef = collection(db, 'games');
        const querySnapshot = await getDocs(gamesRef);
        let sum = 0;
        let count = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          count += 1;
          sum += data.rate;
        });
        setAvgRate(sum / count);
      } catch (error) {
        console.log(error.message);
      }
    };
    getAvgRate();
  }, []);
  useEffect(() => {
    const getTopRatedGames = async () => {
      try {
        const gamesRef = collection(db, 'games');
        const querySnapshot = await getDocs(gamesRef);
        const gamesWithRates = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          gamesWithRates.push({
            name: data.name,
            rate: data.rate,
          });
        });
        const sortedGames = gamesWithRates.sort((a, b) => b.rate - a.rate);
        const top5Games = sortedGames.slice(0, 5);
        setTopFiveGames(top5Games);
      } catch (error) {
        console.log(error.message);
      }
    };
    getTopRatedGames();
  }, []);
  return (
    <div>
      {isLoading ? (
        <div className='flex items-center justify-center h-[80vh]'>
          <Loading />
        </div>
      ) : (
        <div>
          <ToastContainer />
          <LineChartComponent />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-[98%] mx-auto mt-3">
            <CardInfo image={'/paper.png'} title={'Total Users'} value={TotalUsers} />
            <CardInfo image={'/trailer.png'} title={'Total Trailers'} value={TotalTrailers} />
            <CardInfo image={'/report.png'} title={'Total Reports'} value={totalReports} />
          </div>
          <div className="my-3 grid lg:grid-cols-2 sm:grid-cols-1 gap-5 w-[98%] mx-auto">
            <div className="h-[23rem] w-full bg-[#1e1e2f] p-5 rounded-md">
              <h1 className="text-white text-2xl font-bold font-josefin mb-5">Countries</h1>
              <BarChartCountry data={countryCount} />
            </div>
            <div className="h-[23rem] w-full bg-[#1e1e2f] p-5 rounded-md">
              <h1 className="text-white text-2xl font-bold font-josefin mb-5">Average Rate</h1>
              <div className="flex items-center justify-center h-full">
                <div className="relative bottom-[2rem] flex items-center justify-center w-[8rem] h-[8rem] border-4 border-red-800 rounded-full">
                  <h1 className="text-3xl font-bold font-josefin text-green-600">+{avgRate}<span className='text-red-800'>/5</span></h1>
                </div>
              </div>
            </div>
          </div>
          <div className="my-3 w-[98%] mx-auto">
            <div className='bg-[#1e1e2f] w-full p-5 rounded-md'>
              <h1 className='text-white font-poppins font-bold text-3xl'>Top 5 rating games</h1>
              <div className='w-[20rem] p-5 mx-auto'>
                <PieChart data={topFiveGames} />
              </div>
            </div>
          </div>
          <div className='w-[98%] mx-auto'>
            <Report />
          </div>
        </div>
      )}
    </div>
  );
}