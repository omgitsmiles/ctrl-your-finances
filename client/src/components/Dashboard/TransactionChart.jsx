import React, { useEffect } from 'react'
import { Chart } from "react-google-charts";
import { useLocation } from 'react-router-dom';

import CustomCard from './CustomCard';
import Navbar from '../Navbar';
import { AppContext } from '../../context/Context';

const options = {
  title: "Your Spending",
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
  // const location = useLocation()
  // const { transactionData } = location.state

  // console.log("TransactionData:", transactionData)
  // console.log(transactionData.latest_transactions)

  const { transactions } = AppContext();

  const newData = transactions ? transactions.map((categoryGroup) => {
      const category = categoryGroup.category
      const formatted_category = category?.replace(/_/g, " ").replace(/\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() +
                txt.substr(1).toLowerCase();
        })
      return [formatted_category, Number.parseFloat(categoryGroup.amount)]
  }).filter(([_, amount]) => amount >= 0) : null;

  const chartEvents = [
    {
      eventName: "select",
      callback({ chartWrapper }) {
        const selection = chartWrapper.getChart().getSelection();
        if (selection.length > 0) {
          const rowIndex = selection[0].row;
          const transactionCategory = newData[rowIndex][0];
          const transactionAmount = newData[rowIndex][1];
          console.log("Selected Transaction:", transactionCategory, transactionAmount);
        }
      }
    }
  ]
    console.log("Transactions:", transactions)
    console.log("New Data:", newData)

    return (
      <>
        {newData && newData != 0 ? 
        <CustomCard> 
          <h1
            style={{
              color: '#009933',
              fontFamily: 'Poppins, sans-serif',
              textAlign: 'center',
              margin: '1rem'
            }}
          >Transactions</h1>
            <Chart
              chartType="PieChart"
              width="100%"
              height="500px"
              data={[["Task", "Amount"], ...newData]}
              options={options}
              chartEvents={chartEvents}
            />
        </CustomCard>
        : <h2
          style={{
            color: '#009933',
            fontFamily: 'Poppins, sans-serif',
            textAlign: 'center',
            margin: '1rem',
            marginBottom: '0rem'
          }}
        >
          Link your bank accounts to start tracking your spending
        </h2>}
        

      </>
    )
}

export default TransactionChart

// {newData && newData != 0 ? 
        // <CustomCard> 
        //   <h1
        //     style={{
        //       color: '#009933',
        //       fontFamily: 'Poppins, sans-serif',
        //       textAlign: 'center',
        //       margin: '1rem'
        //     }}
        //   >Transactions</h1>
        //     <Chart
        //       chartType="PieChart"
        //       width="100%"
        //       height="500px"
        //       data={[["Task", "Amount"], ...newData]}
        //       options={options}
        //       chartEvents={chartEvents}
        //     />
        // </CustomCard>
        // : <h2
        //   style={{
        //     color: '#009933',
        //     fontFamily: 'Poppins, sans-serif',
        //     textAlign: 'center',
        //     margin: '1rem'
        //   }}
        // >
        //   Link Your Bank Accounts to Start Tracking Your Data
        // </h2>}