import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import GameLevelSelection from '../../components/GameLevelSelection';
import PrivacyPolicyButton from '../../components/PrivacyPolicyButton';
import TermsAndConditionButton from '../../components/TermsAndConditionButton';
import GamePage from '../GamePage/gamePage';

export default function HomePage() {
    const [showGameLevelSelection, setShowGameLevelSelection] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

    const handlePlayClick = () => {
        setShowGameLevelSelection(true);
    };

    const handleSelectLevel = (level: string) => {
        setSelectedLevel(level);
        setShowGameLevelSelection(false);
    };

    if (showGameLevelSelection) {
        return <GameLevelSelection onSelectLevel={handleSelectLevel} />;
    }

    if (selectedLevel) {
        return <GamePage />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/images/title.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.buttonContainer}>
                <CustomButton
                    label="PLAY"
                    handleClick={handlePlayClick}
                    backgroundColor="#493628"
                    width={160}
                />
            </View>
            <View style={styles.bottomButtons}>
                <TermsAndConditionButton />
                <PrivacyPolicyButton />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 100,
    },
    logo: {
        width: '40%',
        height: undefined,
        aspectRatio: 3.5,
        borderRadius: 10,
    },
    buttonContainer: {
        width: 200,
        alignItems: 'center',
        marginBottom: 40,
    },
    bottomButtons: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});
