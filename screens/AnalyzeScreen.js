import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AnalyzeScreen = ({ route, navigation }) => {
  const { team1Players, team2Players } = route.params;

  // Function to get positional value, max rank, and points multiplier based on position
  const getPositionalValue = (position) => {
    switch (position) {
      case 'RB':
        return { value: 2.5, maxRank: 30, pointsMultiplier: 1 };
      case 'WR':
        return { value: 2.5, maxRank: 30, pointsMultiplier: 1 };
      case 'QB':
        return { value: 2, maxRank: 10, pointsMultiplier: 0.4 }; // Add pointsMultiplier for QBs
      case 'TE':
        return { value: 2.5, maxRank: 20, pointsMultiplier: 1.5 };
      case 'K':
        return { value: 0.1, maxRank: 6, pointsMultiplier: 1 };
      default:
        return { value: 0, maxRank: 30, pointsMultiplier: 1 };
    }
  };

  // Function to calculate the value of a player based on their projected rank, positional value, and projected points
  const calculatePlayerValue = (player) => {
    const projectedRank = parseFloat(player.ProjectedRank) || 0;
    const { value: positionalValue, maxRank, pointsMultiplier = 2 } = getPositionalValue(player.Pos); // Default pointsMultiplier to 2
    let invertedRank = maxRank - projectedRank; // Invert the rank by subtracting from the max rank
    if (invertedRank < 0) invertedRank = 0; // Ensure inverted rank is not negative
    const projectedPoints = parseFloat(player.PlayerWeekProjectedPts) || 0;
    let playerValue = (1 * invertedRank) + (2 * positionalValue) + (pointsMultiplier * projectedPoints);

    // Add bonus value for top 5 ranked QBs
    if (player.Pos === 'QB' && projectedRank <= 5) {
      playerValue += 12; // Add a bonus value for top 5 QBs
    }
    

    return playerValue;
  };

  // Function to calculate the total value of a team based on the values of its players
  const calculateTeamValue = (teamPlayers) => {
    const baseValue = teamPlayers.reduce((total, player) => total + calculatePlayerValue(player), 0);
    const highestPlayerValue = Math.max(...teamPlayers.map(player => calculatePlayerValue(player)));
    const penalty = teamPlayers.length > 1 ? (teamPlayers.length - 1) * 5 : 0; // Apply penalty for multiple players
    const teamValue = baseValue - penalty;
    return Math.max(teamValue, highestPlayerValue); // Ensure team value is not less than the highest individual player value
  };

  // Calculate the values of both teams
  const team1Value = calculateTeamValue(team1Players);
  const team2Value = calculateTeamValue(team2Players);

  
  // Function to analyze the trade and determine which team wins
const analyzeTrade = () => {
    const difference = Math.abs(team1Value - team2Value);
    if (difference <= 1) {
      return 'The trade is even!';
    } else if (team1Value > team2Value) {
      return 'Team 1 wins the trade!';
    } else {
      return 'Team 2 wins the trade!';
    }
  };

  const result = analyzeTrade();

  return (
    <LinearGradient
      colors={['#e0f7fa', '#80deea']} // Light blue gradient colors
      style={styles.container}
    >
      <Text style={styles.header}>Trade Analysis</Text>
      <Text style={styles.teamValue}>Team 1 Value: {team1Value.toFixed(2)}</Text>
      <Text style={styles.teamValue}>Team 2 Value: {team2Value.toFixed(2)}</Text>
      <Text style={styles.result}>{result}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000', // Black color
    marginBottom: 20,
    textAlign: 'center',
  },
  teamValue: {
    fontSize: 20,
    color: '#000000', // Black color
    marginBottom: 10,
    textAlign: 'center',
  },
  result: {
    fontSize: 24,
    color: '#000000', // Black color
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AnalyzeScreen;