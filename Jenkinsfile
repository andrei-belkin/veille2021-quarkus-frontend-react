pipeline {
    agent {
        kubernetes {
            inheritFrom 'jenkins-agent'
            yaml '''
                spec:
                  containers:
                  - name: docker
                    image: docker.int.slongpre.com/buildx-cli:latest
                    env:
                    - name: DOCKER_CLI_EXPERIMENTAL
                      value: enabled
                    command: ["sleep"]
                    args: ["999999999"]
                '''
        }
    }

    options {
        ansiColor('xterm')
    }

    stages {
        stage('Setup') {
            steps {
                container('docker') {
                    // Creating build nodes context
                    sh "docker context create node-arm64 --docker host=tcp://pi4.int.slongpre.com:2376"
                    sh "docker context create node-amd64 --docker host=tcp://kube.int.slongpre.com:2376"
                    // Creating multi-node buildx instance
                    sh "docker buildx create --use --name agent-build node-amd64"
                    sh "docker buildx create --append --name agent-build node-arm64"
                }
            }
        }
        stage('Build Docker images') {
            steps {
                parallel(
                        arm64: {
                            container('docker') {
                                dir('react-frontend') {
                                    script {
                                        sh "docker buildx build --target dev --push --platform linux/arm64 -t docker.int.slongpre.com/eq3-frontend:dev-arm64 ."
                                        if (env.BRANCH_NAME == 'master') {
                                            sh "docker buildx build --push --platform linux/arm64 -t docker.int.slongpre.com/eq3-frontend:arm64 ."
                                        }
                                    }
                                }
                            }
                        },
                        amd64: {
                            container('docker') {
                                dir('react-frontend') {
                                    script {
                                        sh "docker buildx build --target dev --push --platform linux/amd64 -t docker.int.slongpre.com/eq3-frontend:dev-amd64 ."
                                        if (env.BRANCH_NAME == 'master') {
                                            sh "docker buildx build --push --platform linux/amd64 -t docker.int.slongpre.com/eq3-frontend:amd64 ."
                                        }
                                    }
                                }
                            }
                        }
                )
            }
        }
        stage('Create and publish multi-arch manifests') {
            steps {
                parallel(
                        dev: {
                            container('docker') {
                                // Multi-arch manifest dev
                                sh 'docker manifest create docker.int.slongpre.com/eq3-frontend:dev-$(date +%Y%m%d) docker.int.slongpre.com/eq3-frontend:dev-amd64 docker.int.slongpre.com/eq3-frontend:dev-arm64'
                                sh 'docker manifest push docker.int.slongpre.com/eq3-frontend:dev-$(date +%Y%m%d)'
                                sh 'docker manifest create docker.int.slongpre.com/eq3-frontend:dev docker.int.slongpre.com/eq3-frontend:dev-amd64 docker.int.slongpre.com/eq3-frontend:dev-arm64'
                                sh "docker manifest push docker.int.slongpre.com/eq3-frontend:dev"
                            }
                        },
                        prod: {
                            script {
                                if (env.BRANCH_NAME == 'master') {
                                    container('docker') {
                                        // Multi-arch manifest prod
                                        sh 'docker manifest create docker.int.slongpre.com/eq3-frontend:$(date +%Y%m%d) docker.int.slongpre.com/eq3-frontend:amd64 docker.int.slongpre.com/eq3-frontend:arm64'
                                        sh 'docker manifest push docker.int.slongpre.com/eq3-frontend:$(date +%Y%m%d)'
                                        sh 'docker manifest create docker.int.slongpre.com/eq3-frontend:latest docker.int.slongpre.com/eq3-frontend:amd64 docker.int.slongpre.com/eq3-frontend:arm64'
                                        sh "docker manifest push docker.int.slongpre.com/eq3-frontend:latest"
                                    }
                                }
                            }
                        }
                )
            }
        }
    }
}
