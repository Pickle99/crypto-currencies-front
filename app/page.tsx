'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {formatCryptoData} from "./utils/formatCryptoData";
import {formatTimestamp} from "@/app/utils/formatTimestamp";

type CryptoData = {
    timestamp: number;
    rate: number;
    high: number;
    low: number;
    vol: number | null;
    cap: number | null;
    sup: number | null;
    change: number;
    change_pct: number;
};

type Rates = {
    [key: string]: CryptoData;
};

type CryptoDate = {
    timestamp: number;
}

export default function Home() {
    const [cryptoRates, setCryptoRates] = useState<Rates>({});
    const [cryptoDate, setCryptoDate] = useState<CryptoDate | null>(null);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true); // Set loading to true when fetching initial data
            try {
                const response = await fetch('http://localhost:8000/currencies/initial');
                const data = await response.json();
                console.log('Fetched initial data:', data);

                if (data.success) {
                    setCryptoRates(data.rates);
                    setCryptoDate({ timestamp: data.timestamp });
                } else {
                    console.error('Error fetching initial data:', data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false); // Set loading to false after fetch
            }
        };

        fetchInitialData();

        const socket = io('http://localhost:8000');

        socket.on('onMessage', (data) => {
            console.log('Received data from server:', data);
            // Set loading to false immediately on receiving new data
            setLoading(false);

            if (data && data.rates) {
                // Update rates with new data
                setCryptoRates(prevRates => ({
                    ...prevRates,  // Keep existing rates
                    ...data.rates   // Update with new rates
                }));
                setCryptoDate({ timestamp: data.timestamp });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="relative w-full max-w-4xl p-4 bg-white shadow-md rounded-lg">
                <div className="overflow-y-auto max-h-96">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                            <p className="ml-2 text-gray-700">Loading...</p>
                        </div>
                    ) : (
                        <>
                            <h1 className="my-2"> Last Update: {formatTimestamp(cryptoDate?.timestamp)} </h1>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3 rounded-s-lg sticky">Crypto/EUR</th>
                                    <th scope="col" className="px-6 py-3">Now</th>
                                    <th scope="col" className="px-6 py-3">High</th>
                                    <th scope="col" className="px-6 py-3">Low</th>
                                    <th scope="col" className="px-6 py-3">Vol</th>
                                    <th scope="col" className="px-6 py-3">Cap</th>
                                    <th scope="col" className="px-6 py-3">Sup</th>
                                    <th scope="col" className="px-6 py-3">Change</th>
                                    <th scope="col" className="px-6 py-3 rounded-e-lg">Change PCT</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.entries(cryptoRates).map(([symbol, cryptoData]) => (
                                    <tr key={symbol} className="bg-white dark:bg-gray-800">
                                        <th
                                            scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                        >
                                            {symbol} / EUR
                                        </th>
                                        <td className="px-6 py-4">{formatCryptoData(cryptoData.rate)} EUR</td>
                                        <td className="px-6 py-4">{formatCryptoData(cryptoData.high)}</td>
                                        <td className="px-6 py-4">{formatCryptoData(cryptoData.low)}</td>
                                        <td className="px-6 py-4">{formatCryptoData(cryptoData.vol)}</td>
                                        <td className="px-6 py-4">{formatCryptoData(cryptoData.cap)}</td>
                                        <td className="px-6 py-4">{formatCryptoData(cryptoData.sup)}</td>
                                        <td className="px-6 py-4">{formatCryptoData(cryptoData.change)}</td>
                                        <td className="px-6 py-4">{formatCryptoData(cryptoData.change_pct)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}



