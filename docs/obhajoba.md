# Obhajoba projektu: Big Data Pipeline Monitor

## 1. Krátké představení projektu

Projekt se jmenuje **Big Data Pipeline Monitor**. Cílem je vytvořit jednoduchou webovou aplikaci, která simuluje evidenci, spouštění a monitoring datových pipeline.

Při obhajobě bych projekt představil takto:

> Big Data Pipeline Monitor je školní aplikace pro správu datových pipeline. Umožňuje evidovat datasety, vytvářet nad nimi pipeline, spouštět jejich běhy, sledovat stav běhů a zobrazovat upozornění při chybě. Aplikace ukazuje principy monitoringu datových procesů, ale nejde o skutečný Spark, Airflow, Databricks ani distribuovanou datovou platformu. Výpočty i stavy běhů jsou zjednodušené a simulované.

Hlavní myšlenka projektu je ukázat typický tok: **dataset -> pipeline -> běh pipeline -> výsledek běhu -> případné upozornění**.

## 2. Struktura prezentace na cca 10 minut

### 1 minuta: cíl projektu

Co říct:

- Projekt řeší zjednodušený monitoring datových pipeline.
- Uživatel může vidět, jaké datasety existují, jaké pipeline nad nimi běží a zda běhy skončily úspěšně nebo chybou.
- Aplikace je školní simulace, takže cílem nebylo nahradit reálný nástroj typu Apache Airflow, ale ukázat základní principy.

Možná formulace:

> Cílem projektu bylo vytvořit přehlednou aplikaci, která simuluje správu a monitoring datových pipeline. Zaměřil jsem se hlavně na doménový model, business pravidla, REST API a jednoduché uživatelské rozhraní.

### 2 minuty: architektura

Co říct:

- Aplikace je rozdělena na frontend, backend a databázi.
- Frontend je napsaný v Reactu a slouží jako uživatelské rozhraní.
- Backend je REST API v Node.js a Expressu.
- Business logika je oddělená ve service vrstvě.
- Data jsou uložená v SQLite databázi přes Prisma ORM.

Možná formulace:

> Frontend posílá HTTP požadavky na Express API. Backend požadavky zvaliduje, provede business logiku ve službách a přes Prisma uloží nebo načte data ze SQLite databáze.

### 2 minuty: doménový model

Co říct:

- Základní entity jsou Dataset, Pipeline, JobRun, AlertRule a AlertEvent.
- Dataset představuje zdroj dat.
- Pipeline představuje proces nad datasetem.
- JobRun je konkrétní spuštění pipeline.
- AlertRule je definice pravidla pro upozornění.
- AlertEvent je konkrétní vzniklé upozornění.

Možná formulace:

> Doménový model je postavený tak, aby bylo možné sledovat celý životní cyklus pipeline. Nejprve existuje dataset, nad ním pipeline, pak konkrétní běh pipeline a při chybě vzniká alert.

### 2 minuty: hlavní business pravidla

Co říct:

- Pipeline může vzniknout pouze nad existujícím datasetem.
- Spustit lze pouze aktivní pipeline.
- Spuštění pipeline vytvoří JobRun ve stavu `running`.
- Běžící run může skončit pouze jako `success` nebo `failed`.
- Neplatné přechody stavů backend odmítne.
- Pokud run selže, vznikne AlertEvent.

Možná formulace:

> Důležité je, že frontend není jediný, kdo hlídá pravidla. Klíčová pravidla jsou na backendu, aby API odmítlo neplatné operace i v případě, že by někdo poslal požadavek mimo frontend.

### 2 minuty: živé demo

Co říct:

- Ukázat Dashboard a souhrnné metriky.
- Vytvořit nový Dataset.
- Vytvořit novou Pipeline nad tímto Datasetem.
- Spustit Pipeline.
- Otevřít detail běhu.
- Označit běh jako `failed`.
- Ukázat, že vznikl AlertEvent.

Možná formulace:

> V demu ukážu hlavní scénář od vytvoření datasetu až po vznik alertu. Tím je vidět, jak aplikace simuluje monitoring datové pipeline.

### 1 minuta: zjednodušení a závěr

Co říct:

- Aplikace neprovádí skutečné distribuované výpočty.
- Nemá skutečný scheduler, Spark cluster, autentizaci ani produkční nasazení.
- Slouží hlavně k ukázce návrhu aplikace, modelu, API, business pravidel a jednoduchého UI.

Možná formulace:

> Projekt je záměrně zjednodušený. Nejde o produkční big data platformu, ale o školní aplikaci, která přehledně ukazuje základní principy evidence, spouštění a monitoringu pipeline.

## 3. Vysvětlení architektury

### Frontend vrstva

Frontend je webová aplikace v **Reactu** vytvořená pomocí **Vite**. Slouží k tomu, aby uživatel mohl pohodlně pracovat s daty přes stránky jako Dashboard, Datasets, Pipelines, detail pipeline, detail runu a Alerts.

Frontend zobrazuje data z backendu, obsahuje formuláře a umožňuje spouštět akce, například vytvoření datasetu nebo spuštění pipeline.

### Backend API vrstva

Backend je napsaný v **Node.js** a **Expressu**. Poskytuje REST API, které přijímá požadavky z frontendu. Typické operace jsou vytvoření datasetu, vytvoření pipeline, spuštění pipeline, změna stavu runu nebo načtení alertů.

Backend také vrací chybové odpovědi, pokud je požadavek neplatný.

### Service/business logika

Business logika je oddělená do service vrstvy. Tato vrstva řeší pravidla aplikace, například:

- zda dataset existuje,
- zda je pipeline aktivní,
- zda je možné změnit stav runu,
- zda má vzniknout alert při chybě.

Díky tomu nejsou pravidla rozházená přímo v routách a kód je lépe čitelný.

### Databázová vrstva

Databázová vrstva používá **SQLite** a **Prisma ORM**. SQLite ukládá data do lokální databáze a Prisma poskytuje typovější a pohodlnější přístup k datům z backendu.

### Komunikace React -> Express API

React komunikuje s backendem přes HTTP požadavky. Pro volání API se používá **Axios**. Například při kliknutí na tlačítko pro spuštění pipeline frontend pošle požadavek na backend a backend vytvoří nový JobRun.

### Komunikace Prisma -> SQLite

Backend nepracuje přímo s ručně psanými SQL dotazy. Používá Prisma klienta, který převádí operace v kódu na dotazy do SQLite databáze. Prisma zároveň vychází ze schématu, kde jsou definované entity a vztahy.

## 4. Vysvětlení doménového modelu

### Dataset

Dataset představuje zdrojová data. V reálném světě by to mohl být například soubor, tabulka, export z databáze nebo datový zdroj. V této aplikaci jde o evidenční záznam, nad kterým se vytvářejí pipeline.

### Pipeline

Pipeline představuje proces, který pracuje nad datasetem. Je navázaná na konkrétní Dataset, protože pipeline musí mít nějaký datový vstup. Pipeline může být aktivní nebo neaktivní.

### JobRun

JobRun je konkrétní spuštění pipeline. Jedna pipeline může být spuštěna vícekrát, a proto má více běhů. JobRun má stav, například `running`, `success` nebo `failed`.

### AlertRule

AlertRule popisuje pravidlo, podle kterého mohou vznikat upozornění. Je to definice, ne konkrétní událost. Například pravidlo může říkat, že při selhání pipeline má vzniknout upozornění.

### AlertEvent

AlertEvent je konkrétní vzniklé upozornění. Vzniká například při neúspěšném JobRunu. Může volitelně odkazovat na AlertRule, pokud upozornění vzniklo podle konkrétního pravidla.

### Vztahy mezi entitami

- **Dataset má více Pipeline**: nad jedním datasetem může existovat více procesů.
- **Pipeline má více JobRun**: jedna pipeline může být spuštěna opakovaně.
- **Pipeline má více AlertRule**: pro jednu pipeline může existovat více pravidel upozornění.
- **JobRun může vytvořit AlertEvent**: při chybě běhu vznikne konkrétní upozornění.
- **AlertEvent může volitelně odkazovat na AlertRule**: upozornění může vzniknout na základě pravidla, ale vazba je volitelná.

## 5. Hlavní business pravidla

- **Pipeline může být vytvořena pouze nad existujícím Datasetem.**
  - Tím se zabrání pipeline bez platného datového vstupu.

- **Pipeline může být spuštěna pouze tehdy, pokud je aktivní.**
  - Neaktivní pipeline může znamenat, že je rozpracovaná, vypnutá nebo nemá být spouštěna.

- **Spuštění Pipeline vytvoří JobRun se stavem `running`.**
  - Stav `running` znamená, že běh právě probíhá.

- **Běžící JobRun může být ukončen jako `success` nebo `failed`.**
  - `success` znamená úspěšné dokončení, `failed` znamená chybu.

- **Neplatné přechody stavů jsou odmítnuty.**
  - Například dokončený běh by se neměl znovu měnit na běžící.

- **Neúspěšný JobRun vytvoří AlertEvent.**
  - Tím aplikace simuluje upozornění na problém v pipeline.

- **AlertRule popisuje pravidlo, AlertEvent je konkrétní vzniklé upozornění.**
  - Pravidlo je obecná definice, event je konkrétní událost v čase.

## 6. Demo scénář

### 1. Otevřít Dashboard

- **Stránka:** Dashboard
- **Akce:** Otevřít hlavní stránku aplikace.
- **Co vysvětlit:** Dashboard slouží jako rychlý přehled nad stavem systému. Uživatel zde vidí základní metriky a může rychle pochopit, kolik je v systému datasetů, pipeline, běhů a alertů.

### 2. Ukázat souhrnné metriky

- **Stránka:** Dashboard
- **Akce:** Ukázat karty nebo sekce se souhrnnými hodnotami.
- **Co vysvětlit:** Tyto metriky nahrazují jednoduchý monitoring. V reálném systému by podobný dashboard pomáhal sledovat, zda datové procesy běží správně.

### 3. Otevřít stránku Datasets

- **Stránka:** Datasets
- **Akce:** Kliknout v navigaci na Datasets.
- **Co vysvětlit:** Dataset je datový zdroj, nad kterým se později vytváří pipeline. Bez datasetu nedává pipeline smysl.

### 4. Vytvořit nový Dataset

- **Stránka:** Datasets
- **Akce:** Vytvořit nový dataset přes formulář, například s názvem `Demo sales dataset`.
- **Co vysvětlit:** Tím přidáváme nový zdroj dat do evidence. Aplikace zatím nepracuje se skutečným souborem, ukládá pouze metadata.

### 5. Otevřít stránku Pipelines

- **Stránka:** Pipelines
- **Akce:** Kliknout v navigaci na Pipelines.
- **Co vysvětlit:** Pipeline představuje proces, který by v reálném světě data načítal, transformoval nebo kontroloval.

### 6. Vytvořit novou Pipeline pro nový Dataset

- **Stránka:** Pipelines
- **Akce:** Vytvořit novou pipeline, vybrat nově vytvořený dataset a uložit ji.
- **Co vysvětlit:** Pipeline je navázaná na dataset. Backend kontroluje, že vybraný dataset skutečně existuje.

### 7. Otevřít detail Pipeline

- **Stránka:** Detail Pipeline
- **Akce:** Kliknout na vytvořenou pipeline.
- **Co vysvětlit:** Detail pipeline ukazuje její informace a související běhy. Tady se dá dobře vysvětlit vztah Pipeline -> JobRun.

### 8. Kliknout na Run pipeline

- **Stránka:** Detail Pipeline
- **Akce:** Kliknout na tlačítko `Run pipeline`.
- **Co vysvětlit:** Spuštěním pipeline vznikne nový JobRun ve stavu `running`. Aplikace tím simuluje start datového procesu.

### 9. Otevřít detail vytvořeného Runu

- **Stránka:** Detail Runu
- **Akce:** Otevřít nově vytvořený run.
- **Co vysvětlit:** Run je konkrétní instance spuštění pipeline. Jedna pipeline může mít mnoho runů, protože ji lze spouštět opakovaně.

### 10. Označit run jako failed

- **Stránka:** Detail Runu
- **Akce:** Označit běh jako `failed`.
- **Co vysvětlit:** Tím simuluji selhání pipeline. Backend ověří, že přechod ze stavu `running` na `failed` je povolený.

### 11. Otevřít stránku Alerts a ukázat vytvořený alert

- **Stránka:** Alerts
- **Akce:** Kliknout v navigaci na Alerts.
- **Co vysvětlit:** Po selhání běhu vznikl AlertEvent. To ukazuje, jak aplikace upozorní na problém v datové pipeline.

### 12. Vysvětlit, jak scénář simuluje monitoring pipeline

- **Stránka:** Alerts nebo Dashboard
- **Akce:** Vrátit se na alert nebo na dashboard.
- **Co vysvětlit:** Demo ukázalo celý tok od datového zdroje přes pipeline a konkrétní běh až po upozornění na chybu. Přesně tento tok je základní princip monitoringu pipeline.

## 7. Návrhová rozhodnutí

### Node.js + Express

Node.js a Express byly zvoleny pro backend, protože umožňují rychle vytvořit přehledné REST API. Express je jednoduchý framework, dobře se hodí pro školní projekt a není zbytečně složitý.

### Prisma

Prisma usnadňuje práci s databází. Místo ručního psaní SQL dotazů používá aplikace Prisma klienta. Výhodou je také přehledné schéma modelů a vztahů.

### SQLite

SQLite byla zvolena proto, že nevyžaduje samostatný databázový server. Pro školní projekt, lokální vývoj a demo je praktická, jednoduchá a snadno spustitelná.

### Zod

Zod slouží k validaci vstupů na backendu. Pomáhá ověřit, že API dostává data ve správném tvaru, například že povinné hodnoty nechybí nebo mají očekávaný typ.

### React + Vite

React byl použit pro frontend, protože dobře podporuje komponentový vývoj. Vite zrychluje vývoj, nabízí jednoduché spuštění projektu a rychlou obnovu změn při programování.

### React Router

React Router řeší navigaci mezi stránkami aplikace. Díky němu má aplikace samostatné stránky jako Dashboard, Datasets, Pipelines a Alerts, i když běží jako single-page aplikace.

### Axios

Axios se používá pro HTTP komunikaci mezi frontendem a backendem. Je přehledný, dobře se s ním pracuje a usnadňuje zpracování odpovědí i chyb z API.

## 8. Zjednodušení projektu

Aplikace je záměrně zjednodušená. Při obhajobě je dobré to říct otevřeně:

- Neprovádí skutečné distribuované výpočty.
- Nemá skutečný scheduler ani plánování úloh v čase.
- Nepoužívá Spark cluster.
- Nepoužívá Apache Airflow ani Databricks.
- Nemá autentizaci a uživatelské role.
- Není nasazena produkčně.
- Nepracuje se skutečnými big data soubory.
- Stavy běhů jsou simulované ručními akcemi v UI.
- Alerty nejsou posílány e-mailem ani do externích systémů.

Tato zjednodušení jsou vědomá. Cílem bylo ukázat návrh webové aplikace, doménový model, API, validaci a základní business pravidla, ne stavět reálnou datovou platformu.

## 9. Možné otázky u obhajoby a odpovědi

### 1. Proč je Pipeline navázána na Dataset?

Protože pipeline zpracovává konkrétní data. Dataset představuje vstup a pipeline bez datasetu by v této doméně nedávala smysl.

### 2. Proč lze spustit pouze aktivní Pipeline?

Aktivní stav říká, že pipeline je připravená ke spuštění. Neaktivní pipeline může být rozpracovaná, vypnutá nebo dočasně nepoužitelná.

### 3. Co se stane, když run selže?

Run se označí jako `failed` a aplikace vytvoří AlertEvent. Tím se simuluje upozornění na problém v pipeline.

### 4. Proč je AlertRule oddělená od AlertEvent?

AlertRule je obecná definice pravidla. AlertEvent je konkrétní upozornění, které vzniklo v určitém čase. Oddělení umožňuje mít jedno pravidlo a více konkrétních událostí.

### 5. Proč byla použita SQLite?

SQLite je jednoduchá databáze vhodná pro lokální vývoj a školní demo. Není potřeba instalovat databázový server a projekt se díky tomu snadněji spouští.

### 6. Kde je implementována business logika?

Business logika je na backendu ve service vrstvě. Tam se kontrolují pravidla jako existence datasetu, aktivní pipeline nebo povolené změny stavů runu.

### 7. Jak je řešena validace vstupů?

Validace vstupů je řešena pomocí Zodu. Backend ověřuje příchozí data z API požadavků a neplatné vstupy odmítne.

### 8. Jak frontend komunikuje s backendem?

Frontend komunikuje s backendem přes HTTP REST API. Pro volání endpointů používá Axios.

### 9. Co by bylo potřeba doplnit v produkční verzi?

V produkční verzi by bylo potřeba doplnit autentizaci, role, robustnější databázi, skutečný scheduler, napojení na reálné výpočty, logování, monitoring, testování provozu a nasazení.

### 10. Jak se tato aplikace liší od Apache Airflow?

Apache Airflow je reálný nástroj pro plánování a řízení workflow. Tato aplikace je pouze jednoduchá školní simulace evidence, spouštění a monitoringu pipeline.

### 11. Proč jsou statusy uložené jako String?

Pro školní projekt je to jednoduché a čitelné řešení. V produkční aplikaci by dávalo smysl zvážit enum nebo přísnější typování stavů podle použité databáze a ORM.

### 12. Jak je řešen error handling?

Backend vrací chybové odpovědi přes API. Neplatné vstupy, nenalezené záznamy nebo porušení business pravidel se vrací jako chyba, kterou frontend může zobrazit uživateli.

### 13. Proč není business logika jen na frontendu?

Protože frontend se dá obejít. Klíčová pravidla musí být na backendu, aby API chránilo data i při přímém volání endpointů.

### 14. Proč používáte Prisma místo přímých SQL dotazů?

Prisma zpřehledňuje práci s databází, drží modely na jednom místě a usnadňuje práci se vztahy mezi entitami.

### 15. Co znamená, že stavy běhů jsou simulované?

Znamená to, že aplikace nespouští skutečný výpočet. Uživatel ručně označí běh jako úspěšný nebo neúspěšný, aby bylo možné ukázat workflow a alerty.

### 16. Jak by šel projekt dál rozšířit?

Šlo by přidat plánování běhů, reálné logy, autentizaci, role, historii změn, napojení na externí výpočetní systém nebo notifikace například e-mailem.

## 10. Závěrečné shrnutí

Možné závěrečné shrnutí:

> Projekt Big Data Pipeline Monitor je jednoduchá školní aplikace, která simuluje správu a monitoring datových pipeline. Ukazuje základní entity jako Dataset, Pipeline, JobRun a Alert, obsahuje business pravidla pro spouštění a ukončování běhů a nabízí jednoduché webové rozhraní pro demo celého procesu. Projekt záměrně nepředstírá produkční big data platformu, ale splňuje svůj cíl: prakticky ukázat návrh, implementaci a obhajitelnou logiku aplikace pro monitoring pipeline.
