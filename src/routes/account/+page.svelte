<header class="flex justify-between mb-5">
    <div class="flex">
        <a href="/" class="text-2xl font-bold text-green-theed">Logs <span class="text-primary">Theed</span></a>
        <img class="ml-1 w-5 object-contain" src="theed-eyes.png" alt="Theed eyes">
    </div>

    <nav>
        <a href="/app" class="bg-gray-900 px-5 py-3 rounded text-gray-100">Retour</a>
    </nav>
</header>

<div class="text-center">
    <h1 class="font-semibold text-2xl mb-5">Mon compte</h1>

    <form class="space-y-4">
        <input type="text" placeholder="Nom" class="border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg" /> <br>
        <input type="email" placeholder="Email" class="border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg" /> <br>
        <select id="selection" name="option" class="h-10 border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg">
            <option value="option1">Pas de notifications</option>
            <option value="option2">DEBUG</option>
            <option value="option3">INFO</option>
            <option value="option3">WARNING</option>
            <option value="option3">ERROR</option>
            <option value="option3">FATAL</option>
        </select> <br>
        <button type="submit" class="bg-primary px-5 py-2 rounded text-gray-100">Enregister</button>
    </form>

    <h2 class="font-semibold text-xl mt-10 mb-5">Changer de mot de passe</h2>

    <form class="space-y-4">
        <input type="password" placeholder="Ancien mot de passe" class="border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg" /> <br>
        <input type="password" placeholder="Nouveau mot de passe" class="border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg" /> <br>
        <button type="submit" class="bg-primary px-5 py-2 rounded text-gray-100">Enregister</button>
    </form>
</div>