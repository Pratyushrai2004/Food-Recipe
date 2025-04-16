pipeline {
    agent any

    tools {
        // Specify the Gradle version to use for this job
        gradle 'Gradle_7'  // Ensure Gradle 7 is configured in Jenkins under Global Tool Configuration
    }

    stages {
        stage('Checkout') {
            steps {
                // Pull the code from the Git repository
                git branch: 'master', url: 'https://github.com/Pratyushrai2004/Food-Recipe.git'
            }
        }

        stage('Build') {
            steps {
                // Build the project using Gradle
                sh './gradlew clean build'
            }
        }

        stage('Test') {
            steps {
                // Run tests (optional)
                sh './gradlew test'
            }
        }

        stage('Store Artifacts') {
            steps {
                // Store or archive the artifacts (optional, can be done locally or in a different repo)
                archiveArtifacts artifacts: 'build/libs/*.jar', allowEmptyArchive: true
            }
        }
    }

    post {
        success {
            // Success message
            echo "Build & Test completed successfully"
        }
        failure {
            // Failure message
            echo "Build Failed"
        }
    }
}
