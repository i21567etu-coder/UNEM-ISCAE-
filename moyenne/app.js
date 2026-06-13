
// (DARK MODE)

const themeToggleBtn = document.getElementById('themeToggle');
const themeToggleIcon = document.getElementById('themeToggleIcon');

if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    if (themeToggleIcon) themeToggleIcon.textContent = '☀️';
} else {
    document.documentElement.classList.remove('dark');
    if (themeToggleIcon) themeToggleIcon.textContent = '🌙';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            if (themeToggleIcon) themeToggleIcon.textContent = '🌙';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
            if (themeToggleIcon) themeToggleIcon.textContent = '☀️';
        }
    });
}

document.getElementById('loadBtn').addEventListener('click', loadAcademicStructure);

function loadAcademicStructure() {
    const specialty = document.getElementById('specialtySelect').value;
    const level = document.getElementById('levelSelect').value;
    
    let semesters = [];
    if (level === 'L1') semesters = ['S1', 'S2'];
    if (level === 'L2') semesters = ['S3', 'S4'];
    if (level === 'L3') semesters = ['S5', 'S6'];

    const container = document.getElementById('semesterTablesContainer');
    container.innerHTML = ''; 
    container.classList.remove('hidden');
    document.getElementById('finalResultBox').classList.remove('hidden');

    semesters.forEach(sem => {
        const semData = academicData[specialty]?.[level]?.[sem] || [];
        
        
        let semesterHTML = `
            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-slate-700 semester-box mb-8" data-semester="${sem}">
                <h2 class="text-xl font-bold text-gray-800 dark:text-slate-200 mb-4 border-b dark:border-slate-700 pb-2 bg-slate-100 dark:bg-slate-900 p-2 rounded text-center">Semestre: ${sem}</h2>
        `;

        if (semData.length === 0) {
            semesterHTML += `<p class="text-amber-600 text-center py-4">Aucune donnée trouvée pour ce semestre.</p></div>`;
            container.innerHTML += semesterHTML;
            return;
        }

        semData.forEach((module, modIndex) => {
            semesterHTML += `
                <div class="mb-6 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 module-group" data-mod-index="${modIndex}">
                    <div class="flex flex-col md:flex-row justify-between items-center gap-2 mb-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border dark:border-slate-700">
                        <span class="font-bold text-gray-700 dark:text-slate-300 text-base md:w-1/4 text-left">${module.moduleName}</span>
                        <div class="flex items-center justify-center gap-4 md:w-2/4 text-center">
                            <span class="text-sm text-gray-500 dark:text-slate-400 font-medium">Moyenne UE:</span>
                            <span class="mod-avg font-extrabold text-lg px-3 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-400 transition-colors duration-200">0.00</span>
                            <span class="mod-status-label px-2 py-0.5 rounded text-xs font-bold hidden bg-slate-100 dark:bg-slate-900 text-slate-500">-</span>
                        </div>
                        <span class="text-sm font-semibold text-gray-600 dark:text-slate-400 md:w-1/4 text-right">
                            Crédits Acquis: <span class="mod-credits font-bold text-blue-600 dark:text-blue-400">0</span>
                        </span>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm">
                            <thead>
    <tr class="border-b dark:border-slate-700 text-slate-400 font-medium"> 
       <th class="pb-2 text-left w-2/5">Matière</th>
       <th class="pb-2 text-center w-1/5">Notes</th>
        <th class="pb-2 text-center w-1/5">Avg</th>
        <th class="pb-2 text-right w-1/5">Statut</th>
    </tr>
</thead>
                            <tbody>
            `;

          module.matieres.forEach((matiere) => {

    let continuousAssessmentLabel = (matiere.name.toLowerCase().includes('modélisation') || matiere.name.toLowerCase().includes('simulation')) ? 'TP' : 'CC';

    semesterHTML += `
        <tr class="border-b last:border-none dark:border-slate-700/50 matiere-row animate-fadeIn" data-credit="${matiere.credit}">
            <td class="py-3 text-left pr-1">
                <div class="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight break-words">${matiere.name}</div>
                <div class="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Credits: ${matiere.credit}</div>
            </td>
            
            <td class="py-3">
                <div class="flex flex-col items-center justify-center gap-1.5">
                    <input type="number" min="0" max="20" step="0.25" placeholder="DEV" 
                        class="w-14 p-1 py-1 text-xs border dark:border-slate-700 bg-white dark:bg-slate-800/80 rounded-md input-devoir text-center font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                    
                    <input type="number" min="0" max="20" step="0.25" placeholder="EX" 
                        class="w-14 p-1 py-1 text-xs border dark:border-slate-700 bg-white dark:bg-slate-800/80 rounded-md input-examen text-center font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
                </div>
            </td>

            <td class="py-3 text-center font-black text-sm text-slate-400 dark:text-slate-500 mat-final-note bg-slate-100/30 dark:bg-slate-900/30 rounded-lg px-1.5">
                0.00
            </td>

            <td class="py-3 text-right pl-1">
                <span class="mat-status-label inline-block px-2 py-0.5 rounded-md text-[11px] font-bold shadow-sm transition-all duration-300 hidden">-</span>
            </td>
        </tr>
    `;
});

            semesterHTML += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        });

     
        semesterHTML += `
                <div class="mt-4 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 font-bold border bg-gray-50 dark:bg-slate-900/60 dark:border-slate-700">
                    <button onclick="revealSemesterResult(this)" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition transform active:scale-95 shadow">
                        🧮 Calculer Moyenne du Semester
                    </button>
                    
                    <div class="hidden-calc-box hidden flex justify-between items-center w-full sm:w-auto gap-4 text-gray-800 dark:text-slate-200">
                        <span>Moyenne Semestre ${sem}: <span class="sem-avg text-xl text-slate-400 font-extrabold">0.00</span></span>
                        <span class="sem-status px-3 py-1 rounded-lg text-sm font-bold hidden">-</span>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += semesterHTML;
    });

    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value !== "") {
                let val = parseFloat(this.value);
                if (val < 0) this.value = 0;
                if (val > 20) this.value = 0;
            }
            calculateEverything();
        });
    });
}

function revealSemesterResult(button) {
    const parentContainer = button.parentElement;
    const resultBox = parentContainer.querySelector('.hidden-calc-box');
    if (resultBox) {
        button.classList.add('hidden'); 
        resultBox.classList.remove('hidden'); 
    }
}




function calculateEverything() {
    const level = document.getElementById('levelSelect').value;
    const semesterBoxes = document.querySelectorAll('.semester-box');
    
    let s1Moyenne = 0, s2Moyenne = 0;
    let s1TotalCoef = 0, s2TotalCoef = 0;
    let totalYearCredits = 0;
    
    let globalHasEliminatory = false;
    let globalHasModuleUnder9 = false;
    let allModulesAbove10 = true;

    let allModulesElements = [];

    semesterBoxes.forEach(box => {
        const semType = box.getAttribute('data-semester');
        const modules = box.querySelectorAll('.module-group');
        let semesterWeightedSum = 0;
        let semesterTotalCoef = 0;

        modules.forEach(mod => {
            let moduleWeightedSum = 0;
            let moduleTotalCredits = 0;
            let moduleHasEliminatory = false;
            let matieresList = [];
            let moduleHasAnyInput = false;

            const rows = mod.querySelectorAll('.matiere-row');
            
            rows.forEach(row => {
                const credit = parseFloat(row.getAttribute('data-credit'));
                const inputDev = row.querySelector('.input-devoir');
                const inputEx = row.querySelector('.input-examen');

                const hasDevVal = inputDev.value !== "";
                const hasExVal = inputEx.value !== "";

                if (hasDevVal || hasExVal) {
                    moduleHasAnyInput = true;
                }

                const devoir = parseFloat(inputDev.value) || 0;
                const examen = parseFloat(inputEx.value) || 0;

                let finalMatiereNote = (devoir * 0.4) + (examen * 0.6);
                const cellFinal = row.querySelector('.mat-final-note');
                cellFinal.textContent = finalMatiereNote.toFixed(2);

                if (finalMatiereNote < 5 && (hasDevVal || hasExVal)) {
                    moduleHasEliminatory = true;
                    globalHasEliminatory = true;
                }

                moduleWeightedSum += (finalMatiereNote * credit);
                moduleTotalCredits += credit;

                matieresList.push({
                    note: finalMatiereNote,
                    credit: credit,
                    hasInput: (hasDevVal || hasExVal),
                    statusLabel: row.querySelector('.mat-status-label'),
                    cellFinal: cellFinal
                });
            });

            let moduleAvg = moduleTotalCredits > 0 ? (moduleWeightedSum / moduleTotalCredits) : 0;
            
            if (moduleHasAnyInput) {
                if (moduleAvg < 9) globalHasModuleUnder9 = true;
                if (moduleAvg < 10) allModulesAbove10 = false;
            }

            allModulesElements.push({
                avg: moduleAvg,
                hasEliminatory: moduleHasEliminatory,
                totalCredits: moduleTotalCredits,
                hasInput: moduleHasAnyInput,
                modAvgCell: mod.querySelector('.mod-avg'),
                modStatusLabel: mod.querySelector('.mod-status-label'),
                modCreditsCell: mod.querySelector('.mod-credits'),
                matieres: matieresList,
                semType: semType
            });

            if (moduleHasAnyInput) {
                semesterWeightedSum += moduleWeightedSum;
                semesterTotalCoef += moduleTotalCredits;
            }
        });

        let semesterAvg = semesterTotalCoef > 0 ? (semesterWeightedSum / semesterTotalCoef) : 0;
        
        if (semType === 'S1' || semType === 'S3' || semType === 'S5') {
            s1Moyenne = semesterAvg;
            s1TotalCoef = semesterTotalCoef;
        }
        if (semType === 'S2' || semType === 'S4' || semType === 'S6') {
            s2Moyenne = semesterAvg;
            s2TotalCoef = semesterTotalCoef;
        }
    });

    let yearlyAvg = 0;
    if (s1TotalCoef > 0 && s2TotalCoef > 0) {
        yearlyAvg = (s1Moyenne + s2Moyenne) / 2;
    } else if (s1TotalCoef > 0) {
        yearlyAvg = s1Moyenne;
    } else if (s2TotalCoef > 0) {
        yearlyAvg = s2Moyenne;
    }

    let isYearlyPassed = (yearlyAvg >= 10 && !globalHasEliminatory && !globalHasModuleUnder9) || (yearlyAvg >= 10 && allModulesAbove10 && !globalHasEliminatory);
    let s1PassedSeparately = s1Moyenne >= 10 && !allModulesElements.filter(m => m.semType === 'S1' || m.semType === 'S3' || m.semType === 'S5').filter(m => m.hasInput).some(m => m.avg < 9 || m.hasEliminatory);
    let s2PassedSeparately = s2Moyenne >= 10 && !allModulesElements.filter(m => m.semType === 'S2' || m.semType === 'S4' || m.semType === 'S6').filter(m => m.hasInput).some(m => m.avg < 9 || m.hasEliminatory);

    allModulesElements.forEach(mod => {
        let isModuleCompensated = false;

        if (mod.hasInput) {
            if ((mod.avg >= 10 && !mod.hasEliminatory) || 
                ((mod.semType === 'S1' || mod.semType === 'S3' || mod.semType === 'S5') && s1PassedSeparately) || 
                ((mod.semType === 'S2' || mod.semType === 'S4' || mod.semType === 'S6') && s2PassedSeparately) || 
                isYearlyPassed) {
                isModuleCompensated = true;
            }

            mod.modAvgCell.textContent = mod.avg.toFixed(2);
            mod.modStatusLabel.classList.remove('hidden');

            if (isModuleCompensated) {
                mod.modAvgCell.className = "mod-avg font-extrabold text-lg px-3 py-1 rounded bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 transition-colors";
                mod.modStatusLabel.textContent = "Validé";
                mod.modStatusLabel.className = "mod-status-label px-2.5 py-0.5 rounded text-xs font-bold bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400";
                mod.modCreditsCell.textContent = mod.totalCredits;
                totalYearCredits += mod.totalCredits;
            } else {
                mod.modAvgCell.className = "mod-avg font-extrabold text-lg px-3 py-1 rounded bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 transition-colors";
                mod.modStatusLabel.textContent = "Rattrapage";
                mod.modStatusLabel.className = "mod-status-label px-2.5 py-0.5 rounded text-xs font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400";
                
                let individualCredits = 0;
                mod.matieres.forEach(mat => { if (mat.note >= 10) individualCredits += mat.credit; });
                mod.modCreditsCell.textContent = individualCredits;
                totalYearCredits += individualCredits;
            }
        }

        mod.matieres.forEach(mat => {
            if (mat.hasInput) {
                mat.statusLabel.classList.remove('hidden');
                if (mat.note >= 10 || isModuleCompensated) {
                    mat.cellFinal.className = "py-3 font-extrabold text-center text-green-600 dark:text-green-400 mat-final-note bg-green-50 dark:bg-green-950/20 px-2 rounded";
                    mat.statusLabel.textContent = "Validé";
                    mat.statusLabel.className = "mat-status-label px-2.5 py-1 rounded-xl text-xs font-bold bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400";
                } else {
                    mat.cellFinal.className = "py-3 font-extrabold text-center text-red-600 dark:text-red-400 mat-final-note bg-red-50 dark:bg-red-950/20 px-2 rounded";
                    mat.statusLabel.textContent = "Rattrapage";
                    mat.statusLabel.className = "mat-status-label px-2.5 py-1 rounded-xl text-xs font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400";
                }
            } else {
                mat.statusLabel.classList.add('hidden');
                mat.cellFinal.className = "py-3 font-extrabold text-center text-slate-400 mat-final-note bg-slate-100/50 dark:bg-slate-900 px-2 rounded";
            }
        });
    });

    semesterBoxes.forEach(box => {
        const semType = box.getAttribute('data-semester');
        const avgCell = box.querySelector('.sem-avg');
        const statusCell = box.querySelector('.sem-status');
        
        let currentAvg = (semType === 'S1' || semType === 'S3' || semType === 'S5') ? s1Moyenne : s2Moyenne;
        let currentTotalCoef = (semType === 'S1' || semType === 'S3' || semType === 'S5') ? s1TotalCoef : s2TotalCoef;

        if (currentTotalCoef > 0) {
            avgCell.textContent = currentAvg.toFixed(2);
            statusCell.classList.remove('hidden');
            
            let isSemValid = ((semType === 'S1' || semType === 'S3' || semType === 'S5') && s1PassedSeparately) || ((semType === 'S2' || semType === 'S4' || semType === 'S6') && s2PassedSeparately) || isYearlyPassed;

            if (isSemValid) {
                avgCell.className = "sem-avg text-xl text-green-600 dark:text-green-400 font-extrabold";
                statusCell.textContent = "Validé";
                statusCell.className = "sem-status px-3 py-1 rounded-lg text-sm font-bold bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400";
            } else {
                avgCell.className = "sem-avg text-xl text-red-600 dark:text-red-400 font-extrabold";
                statusCell.textContent = "Rattrapage";
                statusCell.className = "sem-status px-3 py-1 rounded-lg text-sm font-bold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400";
            }
        } else {
            avgCell.textContent = "0.00";
            statusCell.classList.add('hidden');
        }
    });

    document.getElementById('resS1').textContent = s1Moyenne.toFixed(2);
    document.getElementById('resS2').textContent = s2Moyenne.toFixed(2);
    
    let s1Val = (s1PassedSeparately || isYearlyPassed) && s1TotalCoef > 0;
    let s2Val = (s2PassedSeparately || isYearlyPassed) && s2TotalCoef > 0;
    
    document.getElementById('statusS1').textContent = s1TotalCoef > 0 ? (s1Val ? "Validé" : "Rattrapage") : "-";
    document.getElementById('statusS2').textContent = s2TotalCoef > 0 ? (s2Val ? "Validé" : "Rattrapage") : "-";
    document.getElementById('resYear').textContent = yearlyAvg.toFixed(2);
    document.getElementById('yearCredits').textContent = totalYearCredits;

    document.getElementById('resS1').className = `text-xl font-bold ${s1Val ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`;
    document.getElementById('resS2').className = `text-xl font-bold ${s2Val ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`;
    document.getElementById('statusS1').className = `block text-xs mt-1 font-semibold ${s1Val ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`;
    document.getElementById('statusS2').className = `block text-xs mt-1 font-semibold ${s2Val ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`;

    const statusBox = document.getElementById('academicStatus');
    
    if (s1TotalCoef === 0 && s2TotalCoef === 0) {
        statusBox.textContent = "Veuillez saisir vos notes pour voir le résultat annuel.";
        statusBox.className = "text-sm font-bold text-center p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400";
        return;
    }

    if (isYearlyPassed) {
        statusBox.textContent = "Résultat Annuel: Admis (Année validée avec succès) 🎉";
        statusBox.className = "text-xl font-bold text-center p-3 rounded-lg bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300";
    } else {
        if (yearlyAvg >= 10 && totalYearCredits >= 39 && level !== 'L3') {
            statusBox.textContent = `Résultat Annuel: Admis avec dētte (Crédits acquis: ${totalYearCredits}) ⚠️`;
            statusBox.className = "text-xl font-bold text-center p-3 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300";
        } else if (level === 'L3' && yearlyAvg >= 10 && totalYearCredits >= 39) {
            statusBox.textContent = "Résultat Annuel: Ajourné (Rattrapage requis - Pas de dētte autorisée en L3) ❌";
            statusBox.className = "text-xl font-bold text-center p-3 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300";
        } else {
            statusBox.textContent = "Résultat Annuel: Ajourné (Session de Rattrapage) ❌";
            statusBox.className = "text-xl font-bold text-center p-3 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300";
        }
    }
    
  
const yearAvgCell = document.getElementById('resYear');


yearAvgCell.className = "text-2xl font-black text-blue-600 dark:text-blue-400";

const allSemestersCalculated = currentSemesters.every(s => calculatedSemesters[s]);

    if (allSemestersCalculated) {
        document.getElementById('finalResultBox').classList.remove('hidden');
    } else {
        document.getElementById('finalResultBox').classList.add('hidden');
        document.getElementById('yearlyStatsWrapper').classList.add('hidden');
    }
}
document.addEventListener('click', function(e) {
    if(e.target && e.target.id === 'btnCalcYearly') {
        calculateYearlyAverageStrict();
    }
});

function calculateYearlyAverageStrict() {
    const container = document.getElementById('semesterTablesContainer');
    const allInputs = container.querySelectorAll('input[type="number"]');
    const errorMsg = document.getElementById('yearlyErrorMsg');
    const statsWrapper = document.getElementById('yearlyStatsWrapper');
    
    let isAnyInputEmpty = false;


    allInputs.forEach(input => {
        if (input.value.trim() === "") {
            isAnyInputEmpty = true;
        }
    });

    if (isAnyInputEmpty) {
        errorMsg.classList.remove('hidden');
        statsWrapper.classList.add('hidden');
        return; 
    }


    errorMsg.classList.add('hidden');
    statsWrapper.classList.remove('hidden');

   
    const level = document.getElementById('levelSelect').value;
    let currentSemesters = level === 'L1' ? ['S1', 'S2'] : (level === 'L2' ? ['S3', 'S4'] : ['S5', 'S6']);
    
  
    document.getElementById('resS1').textContent = semStatusData[currentSemesters[0]].avg.toFixed(2);
    document.getElementById('resS2').textContent = semStatusData[currentSemesters[1]].avg.toFixed(2);
    
    let finalYearAvg = (semStatusData[currentSemesters[0]].avg + semStatusData[currentSemesters[1]].avg) / 2;
    document.getElementById('resYear').textContent = finalYearAvg.toFixed(2);
    
    
    document.getElementById('resYear').className = "text-2xl font-black text-blue-600 dark:text-blue-400";

    let s1Valid = semStatusData[currentSemesters[0]].validByComp;
    let s2Valid = semStatusData[currentSemesters[1]].validByComp;
    document.getElementById('resS1').className = `text-xl font-bold ${s1Valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`;
    document.getElementById('resS2').className = `text-xl font-bold ${s2Valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`;
    
    document.getElementById('statusS1').textContent = s1Valid ? (semStatusData[currentSemesters[0]].avg >= 10 ? "Validé" : "Compensé") : "Rattrapage";
    document.getElementById('statusS2').textContent = s2Valid ? (semStatusData[currentSemesters[1]].avg >= 10 ? "Validé" : "Compensé") : "Rattrapage";

    const statusBox = document.getElementById('academicStatus');
    const yearWrapper = document.getElementById('yearBoxWrapper');
    let yearHasAnyEliminatory = currentSemesters.some(s => semStatusData[s].hasEliminatory);


    let finalYearCredits = totalYearCredits; 
    if (finalYearAvg >= 10 && !yearHasAnyEliminatory && !semStatusData[currentSemesters[0]].hasModuleUnder9 && !semStatusData[currentSemesters[1]].hasModuleUnder9) {
        finalYearCredits = 60;
    }
    document.getElementById('yearCredits').textContent = finalYearCredits;

    if (level === 'L3') {
        if (finalYearAvg >= 10 && finalYearCredits === 60 && !yearHasAnyEliminatory) {
            statusBox.textContent = "Résultat Annuel: Admis (Diplôme Obtenu) 🎓🎉";
            statusBox.className = "text-xl font-bold text-center p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400";
            yearWrapper.className = "bg-green-50/50 dark:bg-green-950/20 p-4 rounded-xl text-center border-2 border-green-200 dark:border-green-900/50";
        } else {
            statusBox.textContent = "Résultat Annuel: Ajourné (Session de Rattrapage Obligatoire) ❌";
            statusBox.className = "text-xl font-bold text-center p-3 rounded-lg bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400";
            yearWrapper.className = "bg-red-50/50 dark:bg-red-950/20 p-4 rounded-xl text-center border-2 border-red-200 dark:border-red-900/50";
        }
    } else {
        if (finalYearAvg >= 10 && finalYearCredits === 60 && !yearHasAnyEliminatory) {
            statusBox.textContent = "Résultat Annuel: Admis (Passage) 🎉";
            statusBox.className = "text-xl font-bold text-center p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400";
            yearWrapper.className = "bg-green-50/50 dark:bg-green-950/20 p-4 rounded-xl text-center border-2 border-green-200 dark:border-green-900/50";
        } else if (finalYearAvg >= 10 && finalYearCredits >= 39) {
            statusBox.textContent = `Résultat Annuel: Admis avec dette (${finalYearCredits} / 60) ⚠️`;
            statusBox.className = "text-xl font-bold text-center p-3 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400";
            yearWrapper.className = "bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-xl text-center border-2 border-amber-200 dark:border-amber-900/50";
        } else {
            statusBox.textContent = `Résultat Annuel: Ajourné (Session de Rattrapage) ❌`;
            statusBox.className = "text-xl font-bold text-center p-3 rounded-lg bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400";
            yearWrapper.className = "bg-red-50/50 dark:bg-red-950/20 p-4 rounded-xl text-center border-2 border-red-200 dark:border-red-900/50";
        }
    }
}

