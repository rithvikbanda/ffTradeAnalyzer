import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import qbData from '../PlayerProjections/QB_projected.json';
import rbData from '../PlayerProjections/RB_projected.json';
import wrData from '../PlayerProjections/WR_projected.json';
import teData from '../PlayerProjections/TE_projected.json';
import kData from '../PlayerProjections/K_projected.json';

const combinedData = [...qbData, ...rbData, ...wrData, ...teData, ...kData];

const TradeScreen = ({ navigation }) => {
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [playerInput, setPlayerInput] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  const addPlayerToTeam1 = (player) => {
    if (!team1Players.some(p => p.PlayerId === player.PlayerId) && !team2Players.some(p => p.PlayerId === player.PlayerId)) {
      setTeam1Players([...team1Players, player]);
      setPlayerInput('');
      setFilteredPlayers([]);
    } else {
      alert('Player is already on a team.');
    }
  };

  const addPlayerToTeam2 = (player) => {
    if (!team1Players.some(p => p.PlayerId === player.PlayerId) && !team2Players.some(p => p.PlayerId === player.PlayerId)) {
      setTeam2Players([...team2Players, player]);
      setPlayerInput('');
      setFilteredPlayers([]);
    } else {
      alert('Player is already on a team.');
    }
  };

  const resetTeams = () => {
    setTeam1Players([]);
    setTeam2Players([]);
  };

  const analyzeTrade = () => {
    navigation.navigate('Analyze', { team1Players, team2Players });
  };

  const searchPlayers = (text) => {
    setPlayerInput(text);
    if (text) {
      const filtered = combinedData.filter(player =>
        player.PlayerName.toLowerCase().includes(text.toLowerCase())
      );
      // Sort players so that free agents (FA) are ranked last
      filtered.sort((a, b) => (a.Team === 'FA' ? 1 : -1));
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers([]);
    }
  };

  return (
    <LinearGradient
      colors={['#e0f7fa', '#80deea']} // Light blue gradient colors
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Text style={styles.header}>Trade Proposal</Text>
        <View style={styles.teamContainer}>
          <Text style={styles.teamHeader}>Team 1</Text>
          <FlatList
            data={team1Players}
            renderItem={({ item }) => (
              <Text style={styles.player}>
                {item.PlayerName} ({item.Team})
              </Text>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={styles.teamContainer}>
          <Text style={styles.teamHeader}>Team 2</Text>
          <FlatList
            data={team2Players}
            renderItem={({ item }) => (
              <Text style={styles.player}>
                {item.PlayerName} ({item.Team})
              </Text>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <TextInput
          style={styles.input}
          value={playerInput}
          onChangeText={searchPlayers}
          placeholder="Search for a player"
          placeholderTextColor="#888"
        />
        {filteredPlayers.length > 0 && (
          <FlatList
            data={filteredPlayers}
            renderItem={({ item }) => (
              <View style={styles.playerContainer}>
                <Text style={styles.player}>
                  {item.PlayerName} ({item.Team})
                </Text>
                <View style={styles.addButtonContainer}>
                  <TouchableOpacity style={styles.addButton} onPress={() => addPlayerToTeam1(item)}>
                    <Text style={styles.buttonText}>Add to Team 1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addButton} onPress={() => addPlayerToTeam2(item)}>
                    <Text style={styles.buttonText}>Add to Team 2</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            style={styles.autocompleteContainer}
          />
        )}
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={analyzeTrade}>
            <Text style={styles.buttonText}>Analyze</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={resetTeams}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, // Added padding to move content down
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000', // Black color
    marginBottom: 10, // Reduced margin to move header up
    textAlign: 'center',
  },
  teamContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15, // Reduced margin to move sections up
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  teamHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000', // Black color
    marginBottom: 10, // Reduced margin to move headers up
  },
  player: {
    fontSize: 18,
    color: '#000000', // Black color
    marginBottom: 5,
    flex: 1,
    flexWrap: 'wrap',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  playerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButtonContainer: {
    flexDirection: 'row',
    flexShrink: 1,
  },
  addButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 10, // Slightly increased padding
    paddingHorizontal: 15, // Slightly increased padding
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16, // Slightly increased font size
    fontWeight: 'bold',
  },
  footerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  footerButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginHorizontal: 5,
  },
  autocompleteContainer: {
    maxHeight: 200,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default TradeScreen;