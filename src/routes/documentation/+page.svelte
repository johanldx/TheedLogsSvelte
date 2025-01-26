<script lang="ts">
    import { onMount } from 'svelte';

    // Code par langage
    const codeSnippets = {
        typescript: `type AuthResponse = {
    token: string;
};

type LogResponse = {
    status: string;
    message?: string;
};

async function sendLog(
    applicationUid: number,
    service: string,
    level: string,
    message: string
): Promise<LogResponse> {
    // URLs et credentials
    const authUrl = "https://example.com/api/auth";
    const logUrl = "https://example.com/api/logs";
    const username = "your_username";
    const password = "your_password";

    try {
        // Étape 1 : Obtenir le token JWT
        const authResponse = await fetch(authUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!authResponse.ok) {
            throw new Error(\`Erreur d'authentification : \${authResponse.statusText}\`);
        }

        const authData: AuthResponse = await authResponse.json();

        if (!authData.token) {
            throw new Error("Token non récupéré dans la réponse d'authentification.");
        }

        const jwtToken = authData.token;

        // Étape 2 : Envoyer les logs
        const logResponse = await fetch(logUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: \`Bearer \${jwtToken}\`,
            },
            body: JSON.stringify({
                application_uid: applicationUid,
                service: service,
                level: level,
                message: message,
            }),
        });

        if (!logResponse.ok) {
            throw new Error(\`Erreur lors de l'envoi des logs : \${logResponse.statusText}\`);
        }

        const logData: LogResponse = await logResponse.json();
        return logData;

    } catch (error) {
        console.error("Erreur :", (error as Error).message);
        throw error;
    }
}

// Exemple d'utilisation
sendLog(134, "API", "ERROR", "Message d'erreur")
    .then((response) => {
        console.log("Réponse :", response);
    })
    .catch((error) => {
        console.error("Erreur capturée :", error.message);
    });
`,

        python: `import requests

def send_log(application_uid: int, service: str, level: str, message: str) -> dict:
    # URLs et credentials
    auth_url = "https://example.com/api/auth"
    log_url = "https://example.com/api/logs"
    username = "your_username"
    password = "your_password"

    try:
        # Étape 1 : Obtenir le token JWT via l'API d'authentification
        auth_data = {
            "username": username,
            "password": password
        }
        auth_response = requests.post(auth_url, json=auth_data)

        if auth_response.status_code != 200:
            raise Exception(f"Erreur d'authentification : {auth_response.status_code}, {auth_response.text}")

        auth_response_data = auth_response.json()

        if "token" not in auth_response_data:
            raise Exception("Token non récupéré dans la réponse d'authentification.")

        jwt_token = auth_response_data["token"]

        # Étape 2 : Envoyer les logs via l'API des logs
        log_data = {
            "application_uid": application_uid,
            "service": service,
            "level": level,
            "message": message
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {jwt_token}"
        }
        log_response = requests.post(log_url, json=log_data, headers=headers)

        if log_response.status_code != 200:
            raise Exception(f"Erreur lors de l'envoi des logs : {log_response.status_code}, {log_response.text}")

        return log_response.json()

    except Exception as e:
        print(f"Erreur : {str(e)}")
        raise

# Exemple d'utilisation
try:
    response = send_log(134, "API", "ERROR", "Message d'erreur")
    print("Réponse :", response)
except Exception as e:
    print("Une erreur est survenue :", str(e))
`,

        javascript: `async function sendLog(applicationUid, service, level, message) {
    // Étape 1 : Obtenir le token JWT via l'API d'authentification
    const authUrl = "https://example.com/api/auth";
    const logUrl = "https://example.com/api/logs";

    try {
        // Requête pour obtenir le token
        const authResponse = await fetch(authUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: "your_username",
                password: "your_password",
            }),
        });

        if (!authResponse.ok) {
            throw new Error(\`Erreur d'authentification : \${authResponse.statusText}\`);
        }

        const authData = await authResponse.json();

        if (!authData.token) {
            throw new Error("Token non récupéré dans la réponse d'authentification.");
        }

        const jwtToken = authData.token;

        // Étape 2 : Envoyer les logs via l'API des logs
        const logResponse = await fetch(logUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: \`Bearer \${jwtToken}\`,
            },
            body: JSON.stringify({
                application_uid: applicationUid,
                service: service,
                level: level,
                message: message,
            }),
        });

        if (!logResponse.ok) {
            throw new Error(\`Erreur lors de l'envoi des logs : \${logResponse.statusText}\`);
        }

        const logData = await logResponse.json();
        return logData;

    } catch (error) {
        console.error("Erreur :", error.message);
        throw error;
    }
}

// Exemple d'utilisation
sendLog(134, "API", "ERROR", "Message d'erreur")
    .then((response) => {
        console.log("Réponse :", response);
    })
    .catch((error) => {
        console.error("Erreur capturée :", error.message);
    });
`,

        php: `<?php

function sendLog($applicationUid, $service, $level, $message) {
    // Étape 1 : Obtenir le token JWT via l'API d'authentification
    $authData = [
        'username' => "your_username",
        'password' => "your_password"
    ];
    $authOptions = [
        CURLOPT_URL => "https://example.com/api/auth",
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($authData)
    ];
    $ch = curl_init();
    curl_setopt_array($ch, $authOptions);
    $authResponse = curl_exec($ch);

    if ($authResponse === false) {
        die('Erreur lors de l\'authentification : ' . curl_error($ch));
    }

    $authResponseData = json_decode($authResponse, true);
    curl_close($ch);

    if (!isset($authResponseData['token'])) {
        die('Token non récupéré dans la réponse d\'authentification.');
    }

    $jwtToken = $authResponseData['token'];

    // Étape 2 : Envoyer les logs via l'API des logs
    $logData = [
        'application_uid' => $applicationUid,
        'service' => $service,
        'level' => $level,
        'message' => $message
    ];
    $logOptions = [
        CURLOPT_URL => "https://example.com/api/logs",
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $jwtToken
        ],
        CURLOPT_POSTFIELDS => json_encode($logData)
    ];
    $ch = curl_init();
    curl_setopt_array($ch, $logOptions);
    $logResponse = curl_exec($ch);

    if ($logResponse === false) {
        die('Erreur lors de l\'envoi des logs : ' . curl_error($ch));
    }

    curl_close($ch);

    return $logResponse;
}

// Exemple d'utilisation
$response = sendLog(134, "API", "ERROR", "Message d'erreur");
echo $response;`,
    };

    // Variables pour le langage sélectionné et le bloc de code
    let selectedLanguage = 'javascript'; // Langage par défaut
    let codeBlock: HTMLElement | null = null;

    // Code exécuté côté client
    onMount(() => {
        const languageSelector = document.getElementById('language') as HTMLSelectElement;

        if (languageSelector && codeBlock) {
            // Gestionnaire de changement de langage
            languageSelector.addEventListener('change', (event) => {
                const selectedLanguage = (event.target as HTMLSelectElement).value as keyof typeof codeSnippets;
                if (codeBlock) {
                    codeBlock.textContent = codeSnippets[selectedLanguage];
                }
            });

            // Initialiser avec le premier langage
            const event = new Event('change');
            languageSelector.dispatchEvent(event);
        }
    });
</script>

<svelte:head>
    <title>Documentation</title>
</svelte:head>

<header class="flex justify-between items-center mb-5">
    <div class="flex items-center">
        <a href="/" class="text-2xl font-bold text-green-theed">Logs <span class="text-primary">Theed</span></a>
        <img class="ml-1 w-5 h-5 object-contain" src="theed-eyes.png" alt="Theed eyes">
    </div>

    <nav>
        <button on:click={() => history.back()} class="bg-gray-900 px-5 py-3 rounded text-gray-100">Retour</button>
    </nav>
</header>


<div class="p-6">
    <h1 class="font-semibold text-2xl mb-5">Documentation</h1>
    
    <a class="inline-block underline text-primary mb-5" href="/">Voir la documentation complète</a>

    <div>
        <h2 class="font-semibold text-xl mb-5">Utilisation (exemple)</h2>
        <select id="language" class="w-full border border-gray-300 rounded-lg p-3 mb-6">
            <option value="javascript">JavaScript</option>
            <option value="typescript">Typescript</option>
            <option value="python">Python</option>
            <option value="php">PHP</option>
        </select>
    
        <div id="code-container" class="bg-gray-900 text-white p-4 rounded-lg">
            <pre class="language-code">
                <code id="code-block" bind:this={codeBlock} class="block font-mono">
                </code>
            </pre>
        </div>
    </div>
</div>