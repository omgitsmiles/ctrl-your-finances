import React from 'react'
import { Chart } from "react-google-charts";
import { useLocation } from 'react-router-dom';
import CustomCard from './CustomCard';
import Navbar from './Navbar';

const options = {
    title: "Your Transactions",
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

const TransactionChart = () => {
    const location = useLocation()
    const { transactionData } = location.state

    console.log(transactionData)

    const newData = transactionData?.latest_transactions.map((transaction) => {
        return [transaction?.name, transaction?.amount]
    }).filter(([_, amount]) => amount >= 0)

    const chartEvents = [
        {
          eventName: "select",
          callback({ chartWrapper }) {
            const selection = chartWrapper.getChart().getSelection();
            if (selection.length > 0) {
              const rowIndex = selection[0].row;
              const transactionName = newData[rowIndex][0];
              const transactionAmount = newData[rowIndex][1];
              console.log("Selected Transaction:", transactionName, transactionAmount);
            }
          }
        }
      ]

    console.log(newData)

    return (
        <>
        <Navbar />
        <CustomCard sx={{ alignItems: 'center', justifyContent: 'center' }}> 
                <h1>Transactions</h1>
                        <Chart
                                chartType="PieChart"
                                width="100%"
                                height="500px"
                                data={[["Task", "Amount"], ...newData]}
                                options={options}
                                chartEvents={chartEvents}
                        />
        </CustomCard>
        </>
    )
}

export default TransactionChart