// console.log en bleu claire et en gras dans la console "RefreshEcoleDirecte - Script chargé ✔"
console.log("%cRefreshEcoleDirecte - Script chargé ✔", "color: #3498db; font-weight: bold; font-size: 1.5em;");

setInterval(() => {
  let checker = document.getElementsByClassName('active nav-item ng-star-inserted');

  if (checker.length > 0) {
    if(checker[0]?.innerText === "Evaluations") {

      // Récupérer tous les éléments HTML correspondant à la classe "note cliquable"
      let notes = document.getElementsByClassName('note cliquable');
        if (notes.length > 0) {
      // Filtrer les notes pour supprimer celles contenant "Abs" ou "NE" ou "Disp" ou "EA" ou quelles commencant par "("
      let notesValides = Array.from(notes).filter(note => !note.innerText.includes('Abs') && !note.innerText.includes('NE') && !note.innerText.includes('Disp') && !note.innerText.includes('EA') && !note.innerText.startsWith('('));

      // Initialiser un objet pour stocker les informations sur les notes par discipline
      let notesParDiscipline = {};

      // Parcourir toutes les notes valides
      for (let i = 0; i < notesValides.length; i++) {
          // Récupérer l'élément parent qui contient la discipline et la note
          let parentElement = notesValides[i].closest('tr.ng-star-inserted');

          // Récupérer le nom de la discipline
          let discipline = parentElement.querySelectorAll('td.discipline span.nommatiere')[0].innerText;

          // Extraire la note et le coefficient de la chaîne de texte
          let noteText = notesValides[i].innerText;
          let note, coeff;

          if (noteText.includes('/')) {
              const noteFraction = noteText.split('/');
              note = parseFloat((noteFraction[0].replace(',', '.')) * 20) / parseFloat(noteFraction[1].replace(',', '.'));
              let sized = noteFraction[1].replace("(", "").replace(")", "").split(' ')
              coeff = noteFraction.length > 1 ? parseFloat(sized.length > 1 ? parseFloat(sized[1]) : 1) : 1;

              console.log()
          } else {
              let noteEtCoeff = noteText.split(" ");
              note = parseFloat(noteEtCoeff[0].replace(",", "."))
              coeff = noteEtCoeff.length > 1 ? parseFloat(noteEtCoeff[1].replace("(", "").replace(")", "").replace(",", ".")) : 1;
          }

          // Ajouter la note et le coefficient à l'objet notesParDiscipline
          if (!notesParDiscipline[discipline]) {
              notesParDiscipline[discipline] = {
                  sommeNotes: 0,
                  nbNotesValides: 0
              };
          }

          notesParDiscipline[discipline].sommeNotes += note * coeff;
          notesParDiscipline[discipline].nbNotesValides += coeff;
      }

      // Calculer la moyenne des notes par discipline
      let moyennesParDiscipline = {};

      for (let discipline in notesParDiscipline) {
          let sommeNotes = notesParDiscipline[discipline].sommeNotes;
          let nbNotesValides = notesParDiscipline[discipline].nbNotesValides;
          let moyenne = nbNotesValides != 0 ? sommeNotes / nbNotesValides : 0;
          moyennesParDiscipline[discipline] = moyenne.toFixed(2);
      }

      // Afficher les moyennes par discipline
      for (let discipline in moyennesParDiscipline) {
          //remplacer le contenu de la div moyenne par la moyenne calculée qui est dans un span de class "ng-star-inserted" qui lui meme est dans un td de class "relevemoyenne ng-star-inserted"
          // Récupérer tous les éléments HTML correspondant à la classe "relevemoyenne ng-star-inserted"
          let moyenneElements = document.querySelectorAll('tbody td.relevemoyenne.ng-star-inserted span.ng-star-inserted');
          // Parcourir tous les éléments HTML correspondant à la classe "relevemoyenne ng-star-inserted"
          for (let i = 0; i < moyenneElements.length; i++) {
              // Récupérer l'élément parent qui contient la discipline et la moyenne
              let parentElement = moyenneElements[i].closest('tr.ng-star-inserted');
              // Récupérer le nom de la discipline
              let discipline = parentElement.querySelectorAll('td.discipline span.nommatiere')[0].innerText;
              // Récupérer le contenu de l'élément HTML
              let moyenne = moyenneElements[i].innerText;
              // Remplacer le contenu de l'élément HTML par la moyenne calculée
              let moyenneDisplay = moyennesParDiscipline[discipline]?.replace(".", ",") || " "
              moyenneElements[i].innerHTML = `<span>${moyenneDisplay}</span>`
          }

      }

      // Afficher la moyenne générale par rapport aux différentes moyennes calculées
      let moyenneGenerale = 0;
      let nbNotesValides = 0;
      let coeff = 1;

      for (let discipline in moyennesParDiscipline) {
          let moyenne = moyennesParDiscipline[discipline];
          if (discipline === "STAGE") {
              coeff = 0.5;
          }
          moyenneGenerale += moyenne * coeff;
          nbNotesValides += coeff;
      }

      moyenneGenerale = moyenneGenerale / nbNotesValides;
      moyenneGenerale = moyenneGenerale.toFixed(2);

      let moyenneGElement = document.getElementsByClassName('moyennegenerale-valeur')
      moyenneGElement[0].innerHTML = `<span>${moyenneGenerale?.replace(".", ",")}</span>`

      let textInfo = document.getElementsByClassName('help-block ng-star-inserted');
      // ajoute a la suite du texte mais une fois seulement
      if (textInfo[0].innerHTML.includes("Moyenne générale actualisée") == false) {
      textInfo[0].innerHTML = "<b>Moyenne générale actualisée</b> - Vous êtes en train d'utiliser une version modifiée de l'application qui calcule votre moyenne automatiquement.";
      }
    }
    }
  }

}, 100);
