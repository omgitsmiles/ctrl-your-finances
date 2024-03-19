import React from 'react'
import { Chart } from "react-google-charts";
import { useLocation } from 'react-router-dom';

export const data = [
    ["Task", "Hours per Day"],
    ["Starbucks", 11],
    ["PF Changs", 2],
    ["Gas", 2],
    ["Cable", 2],
    ["Casper", 7], // CSS-style declaration
  ];
  
export const options = {
    title: "Capital One Transactions",
    backgroundColor: "transparent",
    titleTextStyle: {
        color: '#B2BEB5'
    },
    legendTextStyle: {
        color: '#B2BEB5'
    },
    pieHole: 0.3,
    is3D: false,
  };

const SampleChart = () => {
    const location = useLocation()
    const { transactionData } = location.state

    console.log(transactionData)

    const newData = transactionData.latest_transactions
    .map(transaction => {
        return [transaction.name, transaction.amount]
    })
    .filter(([_, amount]) => amount >= 0)

    console.log(newData)

    return (
        <div sx={{ alignItems: 'center', justifyContent: 'center' }}
                onClick={() => console.log(newData)}> 
                <h1>Transactions</h1>
                        <Chart
                                chartType="PieChart"
                                width="100%"
                                height="500px"
                                data={[["Task", "Amount"], ...newData]}
                                options={options}
                        />
        </div>
    )
}

export default SampleChart