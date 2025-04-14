import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const CalculatorScreen = () => {
  const [activeTab, setActiveTab] = useState('emi');
  
  // EMI Calculator states
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [emiResult, setEmiResult] = useState(null);
  
  // SIP Calculator states
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [investmentPeriod, setInvestmentPeriod] = useState('');
  const [sipResult, setSipResult] = useState(null);
  const [suggestedSIP, setSuggestedSIP] = useState(null);
  const [marketTrendData, setMarketTrendData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataError, setDataError] = useState(null);
  // Added state for mutual fund suggestions
  const [suggestedFunds, setSuggestedFunds] = useState(null);

  // Hardcoded mutual funds data
  const mutualFundsData = [
    {
      id: 1,
      name: "HDFC Mid-Cap Opportunities Fund",
      category: "Mid Cap",
      returnRate1Y: 22.4,
      returnRate3Y: 18.7,
      returnRate5Y: 16.2,
      risk: "Moderate to High",
      aum: "33,456 Cr",
      fundManager: "Chirag Setalvad",
      expenseRatio: 1.85,
      riskScore: 7
    },
    {
      id: 2,
      name: "SBI Blue Chip Fund",
      category: "Large Cap",
      returnRate1Y: 16.8,
      returnRate3Y: 14.2,
      returnRate5Y: 12.5,
      risk: "Moderate",
      aum: "28,942 Cr",
      fundManager: "Sohini Andani",
      expenseRatio: 1.78,
      riskScore: 5
    },
    {
      id: 3,
      name: "Aditya Birla Sun Life Tax Relief 96",
      category: "ELSS",
      returnRate1Y: 19.6,
      returnRate3Y: 16.5,
      returnRate5Y: 14.8,
      risk: "Moderate to High",
      aum: "15,780 Cr",
      fundManager: "Mahesh Patil",
      expenseRatio: 1.96,
      riskScore: 6
    },
    {
      id: 4,
      name: "Motilal Oswal Nasdaq 100 FOF",
      category: "International",
      returnRate1Y: 28.2,
      returnRate3Y: 22.5,
      returnRate5Y: 20.3,
      risk: "High",
      aum: "5,467 Cr",
      fundManager: "Ankush Sood",
      expenseRatio: 1.05,
      riskScore: 8
    },
    {
      id: 5,
      name: "SBI Contra Fund",
      category: "Value",
      returnRate1Y: 21.4,
      returnRate3Y: 17.2,
      returnRate5Y: 15.1,
      risk: "High",
      aum: "7,890 Cr",
      fundManager: "R. Srinivasan",
      expenseRatio: 2.05,
      riskScore: 8
    },
    {
      id: 6,
      name: "ICICI Prudential Balanced Advantage Fund",
      category: "Hybrid",
      returnRate1Y: 14.8,
      returnRate3Y: 12.6,
      returnRate5Y: 11.5,
      risk: "Moderate",
      aum: "42,675 Cr",
      fundManager: "Sankaran Naren",
      expenseRatio: 1.65,
      riskScore: 5
    },
    {
      id: 7,
      name: "Axis Small Cap Fund",
      category: "Small Cap",
      returnRate1Y: 26.8,
      returnRate3Y: 20.1,
      returnRate5Y: 17.5,
      risk: "Very High",
      aum: "12,345 Cr",
      fundManager: "Anupam Tiwari",
      expenseRatio: 2.15,
      riskScore: 9
    },
    {
      id: 8,
      name: "DSP Tax Saver Fund",
      category: "ELSS",
      returnRate1Y: 18.4,
      returnRate3Y: 15.8,
      returnRate5Y: 13.5,
      risk: "Moderate to High",
      aum: "8,765 Cr",
      fundManager: "Rohit Singhania",
      expenseRatio: 1.98,
      riskScore: 6
    },
    {
      id: 9,
      name: "Mirae Asset Large Cap Fund",
      category: "Large Cap",
      returnRate1Y: 17.2,
      returnRate3Y: 15.1,
      returnRate5Y: 13.7,
      risk: "Moderate",
      aum: "30,246 Cr",
      fundManager: "Neelesh Surana",
      expenseRatio: 1.73,
      riskScore: 5
    },
    {
      id: 10,
      name: "Franklin India Ultra Short Bond Fund",
      category: "Debt",
      returnRate1Y: 7.5,
      returnRate3Y: 6.4,
      returnRate5Y: 7.1,
      risk: "Low",
      aum: "15,678 Cr",
      fundManager: "Pallab Roy",
      expenseRatio: 0.85,
      riskScore: 3
    }
  ];

  // Fetch market trend data from Groww
  useEffect(() => {
    if (activeTab === 'sip') {
      fetchMarketTrendData();
    }
  }, [activeTab]);

  const fetchMarketTrendData = async () => {
    setIsLoading(true);
    setDataError(null);
    
    try {
      // In a real app, this would be an actual API call to Groww or your backend service
      // For demonstration, we'll simulate a response with typical market data
      // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      // Simulated response data based on typical Groww market trends
      const trendData = {
        equity: {
          conservative: { returnRate: 8, riskScore: 2 },
          balanced: { returnRate: 12, riskScore: 5 },
          aggressive: { returnRate: 15, riskScore: 8 }
        },
        debt: {
          conservative: { returnRate: 6, riskScore: 1 },
          balanced: { returnRate: 7, riskScore: 3 },
          aggressive: { returnRate: 9, riskScore: 4 }
        },
        hybrid: {
          conservative: { returnRate: 7, riskScore: 3 },
          balanced: { returnRate: 10, riskScore: 5 },
          aggressive: { returnRate: 12, riskScore: 6 }
        },
        marketSentiment: "bullish", // Could be "bearish", "neutral", or "bullish"
        recommendedAllocation: {
          equity: 60,
          debt: 30,
          gold: 10
        },
        topPerformingCategories: [
          { name: "Large Cap", avgReturn: 14.5 },
          { name: "Index Funds", avgReturn: 13.2 },
          { name: "Flexi Cap", avgReturn: 12.8 }
        ]
      };
      
      setMarketTrendData(trendData);
    } catch (error) {
      console.error("Error fetching market data:", error);
      setDataError("Unable to fetch market trend data. Using default values.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate EMI
  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const ratePerMonth = parseFloat(interestRate) / (12 * 100);
    const time = parseFloat(loanTenure) * 12;
    
    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, time) / (Math.pow(1 + ratePerMonth, time) - 1);
    
    setEmiResult({
      monthlyPayment: emi.toFixed(2),
      totalPayment: (emi * time).toFixed(2),
      totalInterest: ((emi * time) - principal).toFixed(2)
    });
  };

  // Calculate SIP
  const calculateSIP = () => {
    const investment = parseFloat(monthlyInvestment);
    const returnRate = parseFloat(expectedReturn) / 100;
    const months = parseFloat(investmentPeriod) * 12;
    
    const monthlyRate = returnRate / 12;
    const futureValue = investment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    
    setSipResult({
      futureValue: futureValue.toFixed(2),
      totalInvestment: (investment * months).toFixed(2),
      wealthGained: (futureValue - (investment * months)).toFixed(2)
    });

    // Calculate suggested SIP values
    calculateSuggestedSIP(investment, returnRate, months);
    
    // Generate mutual fund suggestions
    suggestMutualFunds(investment, returnRate, months);
  };

  // Calculate suggested SIP values based on market trends
  const calculateSuggestedSIP = (currentInvestment, userReturnRate, months) => {
    if (!marketTrendData) {
      // Use default values if no market data is available
      const conservativeSIP = currentInvestment * 0.8;
      const conservativeFV = calculateFutureValue(conservativeSIP, userReturnRate * 0.8, months);
      
      const aggressiveSIP = currentInvestment * 1.2;
      const aggressiveFV = calculateFutureValue(aggressiveSIP, userReturnRate * 1.1, months);
      
      setSuggestedSIP({
        conservative: {
          monthly: conservativeSIP.toFixed(2),
          futureValue: conservativeFV.toFixed(2),
          returnRate: (userReturnRate * 0.8 * 100).toFixed(1),
          allocation: "Low risk debt-oriented funds",
          riskScore: 2
        },
        current: {
          monthly: currentInvestment.toFixed(2),
          futureValue: calculateFutureValue(currentInvestment, userReturnRate, months).toFixed(2),
          returnRate: (userReturnRate * 100).toFixed(1),
          allocation: "Your current plan",
          riskScore: 5
        },
        aggressive: {
          monthly: aggressiveSIP.toFixed(2),
          futureValue: aggressiveFV.toFixed(2),
          returnRate: (userReturnRate * 1.1 * 100).toFixed(1),
          allocation: "High growth equity funds",
          riskScore: 8
        }
      });
    } else {
      // Use market data to inform SIP suggestions
      const marketSentiment = marketTrendData.marketSentiment;
      let sentimentMultiplier = 1;
      
      // Adjust recommendations based on market sentiment
      switch (marketSentiment) {
        case "bullish":
          sentimentMultiplier = 1.1; // More aggressive in bullish markets
          break;
        case "bearish":
          sentimentMultiplier = 0.9; // More conservative in bearish markets
          break;
        default:
          sentimentMultiplier = 1; // Neutral sentiment
      }
      
      // Get return rates based on market data
      const conservativeRate = marketTrendData.hybrid.conservative.returnRate / 100;
      const balancedRate = marketTrendData.hybrid.balanced.returnRate / 100;
      const aggressiveRate = marketTrendData.hybrid.aggressive.returnRate / 100;
      
      // Calculate conservative plan (market-informed)
      const conservativeSIP = currentInvestment * 0.9;
      const conservativeFV = calculateFutureValue(conservativeSIP, conservativeRate, months);
      
      // Calculate balanced plan (user's current input with market adjustments)
      const balancedFV = calculateFutureValue(currentInvestment, balancedRate, months);
      
      // Calculate aggressive plan (market-informed)
      const aggressiveSIP = currentInvestment * sentimentMultiplier * 1.2;
      const aggressiveFV = calculateFutureValue(aggressiveSIP, aggressiveRate, months);
      
      // Set the suggested SIP plans with market-informed data
      setSuggestedSIP({
        conservative: {
          monthly: conservativeSIP.toFixed(2),
          futureValue: conservativeFV.toFixed(2),
          returnRate: (conservativeRate * 100).toFixed(1),
          allocation: `${marketTrendData.recommendedAllocation.debt}% Debt, ${marketTrendData.recommendedAllocation.equity - 20}% Equity, ${marketTrendData.recommendedAllocation.gold + 20}% Gold`,
          riskScore: marketTrendData.hybrid.conservative.riskScore
        },
        current: {
          monthly: currentInvestment.toFixed(2),
          futureValue: balancedFV.toFixed(2),
          returnRate: (balancedRate * 100).toFixed(1),
          allocation: `${marketTrendData.recommendedAllocation.debt}% Debt, ${marketTrendData.recommendedAllocation.equity}% Equity, ${marketTrendData.recommendedAllocation.gold}% Gold`,
          riskScore: marketTrendData.hybrid.balanced.riskScore
        },
        aggressive: {
          monthly: aggressiveSIP.toFixed(2),
          futureValue: aggressiveFV.toFixed(2),
          returnRate: (aggressiveRate * 100).toFixed(1),
          allocation: `${marketTrendData.recommendedAllocation.debt - 15}% Debt, ${marketTrendData.recommendedAllocation.equity + 15}% Equity, ${marketTrendData.recommendedAllocation.gold}% Gold`,
          riskScore: marketTrendData.hybrid.aggressive.riskScore
        }
      });
    }
  };

  // Function to suggest mutual funds based on user's SIP details
  const suggestMutualFunds = (monthlyInvestment, returnRate, months) => {
    // Determine risk profile based on expected return and investment period
    let riskProfile;
    const expectedReturnRate = returnRate * 100;
    const years = months / 12;
    
    if (expectedReturnRate <= 8) {
      riskProfile = "conservative";
    } else if (expectedReturnRate <= 14) {
      riskProfile = "balanced";
    } else {
      riskProfile = "aggressive";
    }
    
    // Filter funds based on risk profile
    let filteredFunds = [];
    
    switch (riskProfile) {
      case "conservative":
        // Lower risk score funds
        filteredFunds = mutualFundsData.filter(fund => fund.riskScore <= 4);
        break;
      case "balanced":
        // Medium risk score funds
        filteredFunds = mutualFundsData.filter(fund => fund.riskScore >= 4 && fund.riskScore <= 6);
        break;
      case "aggressive":
        // Higher risk score funds
        filteredFunds = mutualFundsData.filter(fund => fund.riskScore >= 7);
        break;
    }
    
    // If not enough funds match the risk profile, add some from the next closest category
    if (filteredFunds.length < 3) {
      let additionalFunds = [];
      if (riskProfile === "conservative") {
        additionalFunds = mutualFundsData.filter(fund => fund.riskScore === 5);
      } else if (riskProfile === "aggressive") {
        additionalFunds = mutualFundsData.filter(fund => fund.riskScore === 6);
      } else {
        additionalFunds = mutualFundsData.filter(fund => fund.riskScore === 7 || fund.riskScore === 3);
      }
      filteredFunds = [...filteredFunds, ...additionalFunds];
    }
    
    // Shuffle the filtered funds to provide different suggestions each time
    const shuffledFunds = [...filteredFunds].sort(() => 0.5 - Math.random());
    
    // Select top 3 funds for suggestion
    const selectedFunds = shuffledFunds.slice(0, 3);
    
    // Calculate potential returns for each fund
    const suggestedFundsWithReturns = selectedFunds.map(fund => {
      // Use the 3-year return rate for calculation
      const fundReturnRate = fund.returnRate3Y / 100;
      const futureValue = calculateFutureValue(monthlyInvestment, fundReturnRate, months);
      
      return {
        ...fund,
        suggestedMonthlyInvestment: monthlyInvestment.toFixed(2),
        projectedFutureValue: futureValue.toFixed(2),
        projectedWealth: (futureValue - (monthlyInvestment * months)).toFixed(2)
      };
    });
    
    setSuggestedFunds(suggestedFundsWithReturns);
  };

  // Helper function to calculate future value
  const calculateFutureValue = (monthlyInvestment, ratePerAnnum, months) => {
    const monthlyRate = ratePerAnnum / 12;
    return monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  };

  // Generate a risk assessment label based on score (1-10)
  const getRiskLabel = (score) => {
    if (score <= 3) return "Low Risk";
    if (score <= 6) return "Moderate Risk";
    return "High Risk";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EMI & SIP Calculator</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'emi' && styles.activeTab]} 
          onPress={() => setActiveTab('emi')}
        >
          <Text style={[styles.tabText, activeTab === 'emi' && styles.activeTabText]}>EMI Calculator</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'sip' && styles.activeTab]} 
          onPress={() => setActiveTab('sip')}
        >
          <Text style={[styles.tabText, activeTab === 'sip' && styles.activeTabText]}>SIP Calculator</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'emi' ? (
          <View style={styles.calculatorContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Loan Amount (₹)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={loanAmount}
                onChangeText={setLoanAmount}
                placeholder="Enter loan amount"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Interest Rate (% p.a.)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={interestRate}
                onChangeText={setInterestRate}
                placeholder="Enter interest rate"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Loan Tenure (years)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={loanTenure}
                onChangeText={setLoanTenure}
                placeholder="Enter loan tenure"
              />
            </View>
            
            <TouchableOpacity style={styles.calculateButton} onPress={calculateEMI}>
              <Text style={styles.calculateButtonText}>Calculate EMI</Text>
            </TouchableOpacity>
            
            {emiResult && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Your EMI Results</Text>
                
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Monthly Payment</Text>
                  <Text style={styles.resultValue}>₹{emiResult.monthlyPayment}</Text>
                </View>
                
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Total Payment</Text>
                  <Text style={styles.resultValue}>₹{emiResult.totalPayment}</Text>
                </View>
                
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Total Interest</Text>
                  <Text style={styles.resultValue}>₹{emiResult.totalInterest}</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.calculatorContainer}>
            {/* Market Data Status Indicator */}
            {isLoading ? (
              <View style={styles.dataStatusContainer}>
                <ActivityIndicator size="small" color="#00b392" />
                <Text style={styles.dataStatusText}>Fetching market data...</Text>
              </View>
            ) : marketTrendData ? (
              <View style={styles.dataStatusContainer}>
                <MaterialIcons name="check-circle" size={16} color="#00b392" />
                <Text style={styles.dataStatusText}>Market data updated</Text>
              </View>
            ) : dataError ? (
              <View style={styles.dataStatusContainer}>
                <MaterialIcons name="error" size={16} color="#ff6b6b" />
                <Text style={styles.dataStatusText}>{dataError}</Text>
              </View>
            ) : null}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Investment (₹)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={monthlyInvestment}
                onChangeText={setMonthlyInvestment}
                placeholder="Enter monthly investment"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expected Return Rate (% p.a.)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={expectedReturn}
                onChangeText={setExpectedReturn}
                placeholder="Enter expected return rate"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Investment Period (years)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={investmentPeriod}
                onChangeText={setInvestmentPeriod}
                placeholder="Enter investment period"
              />
            </View>
            
            <TouchableOpacity style={styles.calculateButton} onPress={calculateSIP}>
              <Text style={styles.calculateButtonText}>Calculate SIP</Text>
            </TouchableOpacity>
            
            {sipResult && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Your SIP Results</Text>
                
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Future Value</Text>
                  <Text style={styles.resultValue}>₹{sipResult.futureValue}</Text>
                </View>
                
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Total Investment</Text>
                  <Text style={styles.resultValue}>₹{sipResult.totalInvestment}</Text>
                </View>
                
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Wealth Gained</Text>
                  <Text style={styles.resultValue}>₹{sipResult.wealthGained}</Text>
                </View>

                {/* Mutual Fund Suggestions Section */}
                {suggestedFunds && (
                  <View style={styles.mutualFundsContainer}>
                    <Text style={styles.resultTitle}>
                      Recommended Mutual Funds
                      <Text style={styles.marketTrendBadge}>
                        {" "} • Suggested for you
                      </Text>
                    </Text>
                    
                    <Text style={styles.suggestedDescription}>
                      Based on your investment profile, here are some recommended mutual funds:
                    </Text>
                    
                    {suggestedFunds.map((fund, index) => (
                      <View key={index} style={styles.fundCard}>
                        <View style={styles.fundHeader}>
                          <Text style={styles.fundName}>{fund.name}</Text>
                          <View style={[styles.categoryBadge, 
                            fund.category === "Large Cap" ? styles.largeCap :
                            fund.category === "Mid Cap" ? styles.midCap :
                            fund.category === "Small Cap" ? styles.smallCap :
                            fund.category === "ELSS" ? styles.elss :
                            fund.category === "Hybrid" ? styles.hybrid :
                            fund.category === "Debt" ? styles.debt :
                            fund.category === "International" ? styles.international :
                            styles.valueCategory
                          ]}>
                            <Text style={styles.categoryText}>{fund.category}</Text>
                          </View>
                        </View>
                        
                        <View style={styles.fundDetails}>
                          <View style={styles.detailRow}>
                            <View style={styles.detailItem}>
                              <Text style={styles.detailLabel}>1 Year Return</Text>
                              <Text style={styles.returnValue}>+{fund.returnRate1Y}%</Text>
                            </View>
                            <View style={styles.detailItem}>
                              <Text style={styles.detailLabel}>3 Year Return</Text>
                              <Text style={styles.returnValue}>+{fund.returnRate3Y}%</Text>
                            </View>
                            <View style={styles.detailItem}>
                              <Text style={styles.detailLabel}>5 Year Return</Text>
                              <Text style={styles.returnValue}>+{fund.returnRate5Y}%</Text>
                            </View>
                          </View>
                          
                          <View style={styles.fundManager}>
                            <Text style={styles.managerLabel}>Fund Manager:</Text>
                            <Text style={styles.managerValue}>{fund.fundManager}</Text>
                          </View>
                          
                          <View style={styles.fundMetrics}>
                            <View style={styles.metric}>
                              <Text style={styles.metricLabel}>Risk</Text>
                              <View style={[styles.riskBadgeContainer, 
                                fund.riskScore <= 3 ? styles.lowRiskBadge :
                                fund.riskScore <= 6 ? styles.mediumRiskBadge :
                                styles.highRiskBadge
                              ]}>
                                <Text style={styles.riskBadgeText}>{fund.risk}</Text>
                              </View>
                            </View>
                            <View style={styles.metric}>
                              <Text style={styles.metricLabel}>AUM</Text>
                              <Text style={styles.metricValue}>₹{fund.aum}</Text>
                            </View>
                            <View style={styles.metric}>
                              <Text style={styles.metricLabel}>Expense Ratio</Text>
                              <Text style={styles.metricValue}>{fund.expenseRatio}%</Text>
                            </View>
                          </View>
                          
                          <View style={styles.projectionContainer}>
                            <Text style={styles.projectionTitle}>Your Projection with this Fund</Text>
                            <View style={styles.projections}>
                              <View style={styles.projectionItem}>
                                <Text style={styles.projectionLabel}>Monthly Investment</Text>
                                <Text style={styles.projectionValue}>₹{fund.suggestedMonthlyInvestment}</Text>
                              </View>
                              <View style={styles.projectionItem}>
                                <Text style={styles.projectionLabel}>Projected Value</Text>
                                <Text style={[styles.projectionValue, styles.highlightedValue]}>₹{fund.projectedFutureValue}</Text>
                              </View>
                              <View style={styles.projectionItem}>
                                <Text style={styles.projectionLabel}>Wealth Gain</Text>
                                <Text style={[styles.projectionValue, styles.wealthGainValue]}>₹{fund.projectedWealth}</Text>
                              </View>
                            </View>
                          </View>
                          
                          <TouchableOpacity style={styles.investButton}>
                            <Text style={styles.investButtonText}>Invest Now</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                    
                    <View style={styles.disclaimerContainer}>
                      <MaterialIcons name="info" size={16} color="#666" />
                      <Text style={styles.disclaimerText}>
                        Past performance is not indicative of future returns. Mutual funds are subject to market risks.
                      </Text>
                    </View>
                  </View>
                )}

                {suggestedSIP && (
                  <View style={styles.suggestedSipContainer}>
                    <Text style={styles.resultTitle}>
                      Suggested SIP Plans 
                      {marketTrendData && 
                        <Text style={styles.marketTrendBadge}>
                          {" "} • Based on {marketTrendData.marketSentiment} market
                        </Text>
                      }
                    </Text>
                    
                    <Text style={styles.suggestedDescription}>
                      Customized recommendations based on current market trends:
                    </Text>
                    
                    {marketTrendData && marketTrendData.topPerformingCategories && (
                      <View style={styles.topCategoriesContainer}>
                        <Text style={styles.categoryTitle}>Top Performing Categories</Text>
                        <View style={styles.categoriesList}>
                          {marketTrendData.topPerformingCategories.map((category, index) => (
                            <View key={index} style={styles.categoryItem}>
                              <Text style={styles.categoryName}>{category.name}</Text>
                              <Text style={styles.categoryReturn}>+{category.avgReturn}%</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                    
                    {/* Conservative Plan */}
                    <View style={[styles.planCard, styles.conservativePlan]}>
                      <View style={styles.planHeader}>
                        <Text style={styles.planTitle}>Conservative Plan</Text>
                        <View style={styles.riskIndicator}>
                          <Text style={styles.riskText}>{getRiskLabel(suggestedSIP.conservative.riskScore)}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.planDetails}>
                        <View style={styles.planDetail}>
                          <Text style={styles.planDetailLabel}>Monthly SIP</Text>
                          <Text style={styles.planDetailValue}>₹{suggestedSIP.conservative.monthly}</Text>
                        </View>
                        <View style={styles.planDetail}>
                          <Text style={styles.planDetailLabel}>Expected Return</Text>
                          <Text style={styles.planDetailValue}>{suggestedSIP.conservative.returnRate}%</Text>
                        </View>
                        <View style={styles.planDetail}>
                          <Text style={styles.planDetailLabel}>Future Value</Text>
                          <Text style={[styles.planDetailValue, styles.highlightValue]}>
                            ₹{suggestedSIP.conservative.futureValue}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.allocationContainer}>
                        <Text style={styles.allocationTitle}>Recommended Allocation</Text>
                        <Text style={styles.allocationText}>{suggestedSIP.conservative.allocation}</Text>
                      </View>
                      
                      <TouchableOpacity style={styles.planButton}>
                        <Text style={styles.planButtonText}>Select This Plan</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {/* Current Plan */}
                    <View style={[styles.planCard, styles.currentPlan]}>
                      <View style={styles.planHeader}>
                        <Text style={styles.planTitle}>Your Current Plan</Text>
                        <View style={styles.riskIndicator}>
                          <Text style={styles.riskText}>{getRiskLabel(suggestedSIP.current.riskScore)}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.planDetails}>
                        <View style={styles.planDetail}>
                          <Text style={styles.planDetailLabel}>Monthly SIP</Text>
                          <Text style={styles.planDetailValue}>₹{suggestedSIP.current.monthly}</Text>
                        </View>
                        <View style={styles.planDetail}>
                          <Text style={styles.planDetailLabel}>Expected Return</Text>
                          <Text style={styles.planDetailValue}>{suggestedSIP.current.returnRate}%</Text>
                        </View>
                        <View style={styles.planDetail}>
                          <Text style={styles.planDetailLabel}>Future Value</Text>
                          <Text style={[styles.planDetailValue, styles.highlightValue]}>
                            ₹{suggestedSIP.current.futureValue}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.allocationContainer}>
                        <Text style={styles.allocationTitle}>Recommended Allocation</Text>
                        <Text style={styles.allocationText}>{suggestedSIP.current.allocation}</Text>
                      </View>
                      
                      <TouchableOpacity style={[styles.planButton, styles.currentPlanButton]}>
                        <Text style={styles.currentPlanButtonText}>Current Selection</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {/* Aggressive Plan */}
                    <View style={[styles.planCard, styles.aggressivePlan]}>
                      <View style={styles.planHeader}>
                        <Text style={styles.planTitle}>Aggressive Plan</Text>
                        <View style={styles.riskIndicator}>
                          <Text style={styles.riskText}>{getRiskLabel(suggestedSIP.aggressive.riskScore)}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.planDetails}>
                        <View style={styles.planDetail}>
                          <Text style={styles.planDetailLabel}>Monthly SIP</Text>
                          <Text style={styles.planDetailValue}>₹{suggestedSIP.aggressive.monthly}</Text>
                        </View>
                        <View style={styles.planDetail}>
                          <Text style={styles.planDetailLabel}>Expected Return</Text>
                          <Text style={styles.planDetailValue}>{suggestedSIP.aggressive.returnRate}%</Text>
                        </View>
                        <View style={styles.planDetail}>
                          <Text style={styles.planDetailLabel}>Future Value</Text>
                          <Text style={[styles.planDetailValue, styles.highlightValue]}>
                            ₹{suggestedSIP.aggressive.futureValue}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.allocationContainer}>
                        <Text style={styles.allocationTitle}>Recommended Allocation</Text>
                        <Text style={styles.allocationText}>{suggestedSIP.aggressive.allocation}</Text>
                      </View>
                      
                      <TouchableOpacity style={styles.planButton}>
                        <Text style={styles.planButtonText}>Select This Plan</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00b392',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#00b392',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  calculatorContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  calculateButton: {
    backgroundColor: '#00b392',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 24,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  dataStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f0f9f6',
    padding: 10,
    borderRadius: 6,
  },
  dataStatusText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 8,
  },
  suggestedSipContainer: {
    marginTop: 24,
  },
  marketTrendBadge: {
    fontSize: 12,
    color: '#5c6bc0',
    fontWeight: 'normal',
  },
  suggestedDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  conservativePlan: {
    borderLeftColor: '#4caf50',
  },
  currentPlan: {
    borderLeftColor: '#5c6bc0',
  },
  aggressivePlan: {
    borderLeftColor: '#ff9800',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  riskIndicator: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  riskText: {
    fontSize: 12,
    color: '#666',
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  planDetail: {
    flex: 1,
  },
  planDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  planDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  highlightValue: {
    color: '#00b392',
    fontSize: 16,
  },
  allocationContainer: {
    marginBottom: 16,
  },
  allocationTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  allocationText: {
    fontSize: 13,
    color: '#666',
  },
  planButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  planButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  currentPlanButton: {
    backgroundColor: '#e8f0fe',
  },
  currentPlanButtonText: {
    color: '#1a73e8',
    fontWeight: '500',
  },
  topCategoriesContainer: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoriesList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryReturn: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4caf50',
  },
  mutualFundsContainer: {
    marginTop: 24,
  },
  fundCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  fundHeader: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fundName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#fff',
  },
  largeCap: {
    backgroundColor: '#5c6bc0',
  },
  midCap: {
    backgroundColor: '#26a69a',
  },
  smallCap: {
    backgroundColor: '#ef5350',
  },
  elss: {
    backgroundColor: '#8d6e63',
  },
  hybrid: {
    backgroundColor: '#7e57c2',
  },
  debt: {
    backgroundColor: '#66bb6a',
  },
  international: {
    backgroundColor: '#42a5f5',
  },
  valueCategory: {
    backgroundColor: '#ff7043',
  },
  fundDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  returnValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4caf50',
  },
  fundManager: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  managerLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  managerValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  fundMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  riskBadgeContainer: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  lowRiskBadge: {
    backgroundColor: '#e8f5e9',
  },
  mediumRiskBadge: {
    backgroundColor: '#fff3e0',
  },
  highRiskBadge: {
    backgroundColor: '#ffebee',
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  projectionContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  projectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  projections: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectionItem: {
    flex: 1,
  },
  projectionLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  projectionValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  highlightedValue: {
    color: '#00b392',
    fontWeight: '600',
  },
  wealthGainValue: {
    color: '#4caf50',
  },
  investButton: {
    backgroundColor: '#00b392',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  investButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  }
});

export default CalculatorScreen;