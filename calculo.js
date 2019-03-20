(function () {
  /**
   * Obtém o ano corrente
   */
  const currentYear = new Date().getFullYear();

  /**
   * =============================================================================
   * Regime atual
   * =============================================================================
   */

  /**
   * -----------------------------------------------------------------------------
   * Aposentadoria por idade
   * -----------------------------------------------------------------------------
   */

  /**
   * Retorna a idade mínima para se aposentar por idade mantendo o regime atual,
   * sendo 65 anos para homens e 60 para mulheres
   *
   * @param {String} gender: homem ou mulher
   *
   * @return {Integer}: idade mínima para se aposentar
   */
  const minAgeCurrent = function minAgeCurrent(gender) {
    return gender === 'male' ? 65 : 60;
  }

  /**
   * Calcula quando uma pessoa poderá se aposentar por idade e
   * ter direito ao benefício integral de acordo com o regime atual
   *
   * @param {String} gender: homem ou mulher
   * @param {Integer} age: idade no ano corrente
   * @param {Integer} contribution: tempo de contribuição no ano corrente
   *
   * @return {Object}: quanto tempo falta, idade, ano e valor do benefício
   */
  const calculateCurrentByAge = function calculateCurrentByAge(gender, age, contribution, round = true) {
    /**
     * Idade mínima para poder se aposentar por idade
     */
    const minAge = minAgeCurrent(gender);

    /**
     * Contribuição mínima para benefício integral por idade
     * no regime atual é de 30 anos para ambos os sexos
     */
    const minContribution = 30;

    /**
     * Quantidade de anos necessária para aposentar com benefício integral
     */
    let debt;

    /**
     * Se o tempo de contribuição for maior ou igual a 30 anos,
     * calcula a diferença entre a idade mínima e a idade atual
     */
    if (contribution >= minContribution) {
      debt = minAge - age;
    } else {
      /**
       * Calcula quantos anos faltam para atingir 30 de contribuição
       */
      debt = minContribution - contribution;

      /**
       * Calcula a idade que a pessoa teria ao somar este débito
       */
      let newAge = age + debt;

      /**
       * Se esta nova idade for menor que a mínima,
       * adiciona a diferença ao débito
       */
      if (newAge < minAge) {
        debt += minAge - newAge;
      }
    }

    // TODO: considerar caso de aposentadoria compulsória

    /**
     * O débito não pode ser negativo
     */
    debt = Math.max(0, debt);


    /**
     * Arredonda o débito
     */
    if (round) {
      debt = Math.round(debt);
    }

    /**
     * Valor do benefício
     */
    // TODO: multiplicar pelo fator previdenciário quando necessário
    const value = Math.min(100, 70 + contribution + debt);

    /**
     * Retorna quantos anos faltam, valor do benefício, idade,
     * tempo de contribuição e ano que poderá se aposentar recebendo
     * o benefício integral ou o maior valor possível em caso de
     * aposentadoria compusória
     */
    return {
      debt,
      value,
      age: age + debt,
      contribution: contribution + debt,
      points: age + contribution + debt * 2,
      year: currentYear + debt,
    };
  };

  /**
   * -----------------------------------------------------------------------------
   * Aposentadoria pelo sistema de pontos
   * -----------------------------------------------------------------------------
   */

  /**
   * Retorna a quantidade de pontos necessária para se aposentar
   * pelo sistema de pontos mantendo o regime atual
   *
   * @param {String} gender: homem ou mulher
   * @param {Integer} year: ano
   *
   * @return {Integer}: mínimo de pontos naquele ano
   */
  const minPointsCurrent = function minPointsCurrent(gender, year) {
    let points;

    switch (year) {
      case 2019:
      case 2020:
        points = 86;
        break;
      case 2021:
      case 2022:
        points = 87;
        break;
      case 2023:
      case 2024:
        points = 88;
        break;
      case 2025:
      case 2026:
        points = 89;
        break;
      default:
        points = 90;
    }

    if (gender === 'male') {
      points += 10;
    }

    return points;
  };

  /**
   * Calcula quando uma pessoa poderá se aposentar pelo sistema de pontos e
   * ter direito ao benefício integral mantendo o regime atual
   *
   * @param {String} gender: homem ou mulher
   * @param {Integer} age: idade no ano corrente
   * @param {Integer} contribution: tempo de contribuição no ano corrente
   *
   * @return {Object}: quanto tempo falta, idade, ano e valor do benefício
   */
  const calculateCurrentByPoints = function calculateCurrentByPoints(gender, age, contribution, round = true) {
    /**
     * Quantidade de pontos que a pessoa tem atualmente
     */
    let points = age + contribution;

    /**
     * Quantidade mínima de pontos para uma pessoa se aposentar no ano corrente
     */
    let minPoints = minPointsCurrent(gender, currentYear);

    /**
     * Contribuição mínima para benefício integral por idade no regime atual
     * é de 35 anos para homens e 30 para mulheres
     */
    const minContribution = gender === 'male' ? 35 : 30;

    /**
     * Quantidade de anos necessária para aposentar com benefício integral
     */
    let debt;

    /**
     * Se o tempo de contribuição for maior ou igual ao mínimo,
     * calcula a diferença entre o mínimo de pontos e a quantidade atual
     *
     * Caso contrário, calcula quantos anos faltam para atingir o mínimo
     */
    if (contribution >= minContribution) {
      debt = Math.floor((minPoints - points) / 2);
    } else {
      debt = minContribution - contribution;
    }

    /**
     * O débito não pode ser negativo
     */
    debt = Math.max(0, debt);

    /**
     * Calcula a idade que a pessoa teria ao somar este débito
     */
    let newAge = age + debt;

    /**
     * Calcula a quantidade de pontos que a pessoa teria ao somar este débito
     */
    points += debt * 2;

    /**
     * Calcula o ano ao somar este débito ao ano corrente
     */
    let year = Math.floor(currentYear + debt);

    /**
     * Obtém a quantidade mínima de pontos naquele ano
     */
    minPoints = minPointsCurrent(gender, year);

    /**
     * Enquanto esta nova idade for menor que a mínima,
     * adiciona 6 meses ao débito e mais 1 ponto
     */
    while (points < minPoints) {
      debt += 0.5;
      newAge = age + debt;
      points += 1;
      year = Math.floor(currentYear + debt);
      minPoints = minPointsCurrent(gender, year);
    }

    // TODO: considerar caso de aposentadoria compulsória

    /**
     * Arredonda o débito
     */
    if (round) {
      debt = Math.round(debt);
    }

    /**
     * Valor inicial do benefício
     */
    // TODO: multiplicar pelo fator previdenciário quando necessário
    const value = 100;

    /**
     * Retorna quantos anos faltam, valor do benefício, idade,
     * tempo de contribuição e ano que poderá se aposentar recebendo
     * o benefício integral ou o maior valor possível em caso de
     * aposentadoria compusória
     */
    return {
      debt,
      value,
      age: age + debt,
      contribution: contribution + debt,
      points: age + contribution + debt * 2,
      year: Math.floor(currentYear + debt),
    };
  };

  /**
   * =============================================================================
   * Regra de transição
   * =============================================================================
   */

  /**
   * -----------------------------------------------------------------------------
   * Aposentadoria por idade
   * -----------------------------------------------------------------------------
   */

  /**
   * Retorna a idade mínima necessária para se aposentar por idade
   * durante a transição, sendo que a do homem se mantém 65 anos e
   * a da mulher segue uma progressão a partir dos 60 anos,
   * aumentando 6 meses a cada ano até atingir os 62 em 2023
   *
   * @param {String} gender: homem ou mulher
   * @param {Integer} year: ano
   *
   * @return {Float}: idade mínima naquele ano
   */
  const minAgeTransition = function minAgeTransition(gender, year) {
    const initialYear = 2019;
    const rateAge = 0.5;

    let initialAge;
    let finalAge;

    if (gender === 'male') {
      initialAge = 65;
      finalAge = 65;
    } else {
      initialAge = 60;
      finalAge = 62;
    }

    return Math.min(initialAge + (year - initialYear) * rateAge, finalAge);
  };

  /**
   * Calcula quando uma pessoa poderá se aposentar por idade e
   * ter direito ao benefício integral durante a regra de transição
   *
   * @param {String} gender: homem ou mulher
   * @param {Integer} age: idade no ano corrente
   * @param {Integer} contribution: tempo de contribuição no ano corrente
   *
   * @return {Object}: quanto tempo falta, idade, ano e valor do benefício
   */
  const calculateTransitionByAge = function calculateTransitionByAge(gender, age, contribution, round = true) {
    /**
     * Idade mínima para uma pessoa se aposentar no ano corrente
     */
    let minAge = minAgeTransition(gender, currentYear);

    /**
     * Contribuição mínima para benefício integral por idade durante a transição
     * é de 40 anos para ambos os sexos
     */
    const minContribution = 40;

    /**
     * Quantidade de anos necessária para aposentar com benefício integral
     */
    let debt;

    /**
     * Se o tempo de contribuição for maior ou igual a 40 anos,
     * calcula a diferença entre a idade mínima e a idade atual
     */
    if (contribution >= minContribution) {
      debt = minAge - age;
    } else {
      /**
       * Calcula quantos anos faltam para atingir 40 de contribuição
       */
      debt = minContribution - contribution;

      /**
       * Calcula a idade que a pessoa teria ao somar este débito
       */
      let newAge = age + debt;

      /**
       * Calcula o ano ao somar este débito ao ano corrente
       */
      let year = Math.floor(currentYear + debt);

      /**
       * Obtém a idade mínima naquele ano
       */
      minAge = minAgeTransition(gender, year);

      /**
       * Enquanto esta nova idade for menor que a mínima,
       * adiciona 6 meses ao débito
       */
      while (newAge < minAge) {
        debt += 0.5;
        newAge = age + debt;
        year = Math.floor(currentYear + debt);
        minAge = minAgeTransition(gender, year);
      }
    }

    // TODO: considerar caso de aposentadoria compulsória

    /**
     * O débito não pode ser negativo
     */
    debt = Math.max(0, debt);

    /**
     * Arredonda o débito
     */
    if (round) {
      debt = Math.round(debt);
    }

    /**
     * Valor inicial do benefício
     */
    const value = Math.min(100, 60 + (contribution + debt - 20) * 2);

    /**
     * Retorna quantos anos faltam, valor do benefício, idade,
     * tempo de contribuição e ano que poderá se aposentar recebendo
     * o benefício integral ou o maior valor possível em caso de
     * aposentadoria compusória
     */
    return {
      debt,
      value,
      age: age + debt,
      contribution: contribution + debt,
      points: age + contribution + debt * 2,
      year: Math.floor(currentYear + debt),
    };
  };

  /**
   * -----------------------------------------------------------------------------
   * Aposentadoria pelo sistema de pontos
   * -----------------------------------------------------------------------------
   */

  /**
   * Retorna a quantidade de pontos necessária para se aposentar pelo
   * sistema de pontos durante o período de transição
   *
   * @param {String} gender: homem ou mulher
   * @param {Integer} year: ano
   *
   * @return {Integer}: mínimo de pontos naquele ano
   */
  const minPointsTransition = function minPointsTransition(gender, year) {
    const initialYear = 2019;
    const ratePoints = 1;

    let initialPoints;
    let finalPoints;

    if (gender === 'male') {
      initialPoints = 96;
      finalPoints = 105;
    } else {
      initialPoints = 86;
      finalPoints = 100;
    }

    return Math.min(initialPoints + (year - initialYear) * ratePoints, finalPoints);
  };

  /**
   * Calcula quando uma pessoa poderá se aposentar pelo sistema de pontos e
   * ter direito ao benefício integral durante a regra de transição
   *
   * @param {String} gender: homem ou mulher
   * @param {Integer} age: idade no ano corrente
   * @param {Integer} contribution: tempo de contribuição no ano corrente
   *
   * @return {Object}: quanto tempo falta, idade, ano e valor do benefício
   */
  const calculateTransitionByPoints = function calculateTransitionByPoints(gender, age, contribution, round = true) {
    /**
     * Quantidade de pontos que a pessoa tem atualmente
     */
    let points = age + contribution;

    /**
     * Quantidade mínima de pontos para uma pessoa se aposentar no ano corrente
     */
    let minPoints = minPointsTransition(gender, currentYear);

    /**
     * Contribuição mínima para benefício integral pelo sistema de pontos
     * durante a transição é de 40 anos para ambos os sexos
     */
    const minContribution = 40;

    /**
     * Quantidade de anos necessária para aposentar com benefício integral
     */
    let debt;

    /**
     * Se o tempo de contribuição for maior ou igual ao mínimo,
     * calcula a diferença entre o mínimo de pontos e a quantidade atual
     *
     * Caso contrário, calcula quantos anos faltam para atingir o mínimo
     */
    if (contribution >= minContribution) {
      debt = Math.floor((minPoints - points) / 2);
    } else {
      debt = minContribution - contribution;
    }

    /**
     * O débito não pode ser negativo
     */
    debt = Math.max(0, debt);

    /**
     * Calcula a idade que a pessoa teria ao somar este débito
     */
    let newAge = age + debt;

    /**
     * Calcula a quantidade de pontos que a pessoa teria ao somar este débito
     */
    points += debt * 2;

    /**
     * Calcula o ano ao somar este débito ao ano corrente
     */
    let year = Math.floor(currentYear + debt);

    /**
     * Obtém a quantidade mínima de pontos naquele ano
     */
    minPoints = minPointsTransition(gender, year);

    /**
     * Enquanto esta nova idade for menor que a mínima,
     * adiciona 6 meses ao débito e mais 1 ponto
     */
    while (points < minPoints) {
      debt += 0.5;
      newAge = age + debt;
      points += 1;
      year = Math.floor(currentYear + debt);
      minPoints = minPointsTransition(gender, year);
    }

    // TODO: considerar caso de aposentadoria compulsória

    /**
     * Arredonda o débito
     */
    if (round) {
      debt = Math.round(debt);
    }

    /**
     * Valor inicial do benefício
     */
    const value = Math.min(100, 60 + (contribution + debt - 20) * 2);

    /**
     * Retorna quantos anos faltam, valor do benefício, idade,
     * tempo de contribuição e ano que poderá se aposentar recebendo
     * o benefício integral ou o maior valor possível em caso de
     * aposentadoria compusória
     */
    return {
      debt,
      value,
      age: age + debt,
      contribution: contribution + debt,
      points: age + contribution + debt * 2,
      year: Math.floor(currentYear + debt),
    };
  };

  /**
   * =============================================================================
   * Regime novo
   * =============================================================================
   */

  /**
   * -----------------------------------------------------------------------------
   * Aposentadoria por idade
   * -----------------------------------------------------------------------------
   */

  /**
   * Retorna a idade mínima para se aposentar por idade na nova regra,
   * sendo 65 anos para homens e 60 para mulheres
   *
   * @param {String} gender: homem ou mulher
   *
   * @return {Integer}: idade mínima para se aposentar
   */
  const minAgeNew = function minAgeNew(gender) {
    return gender === 'male' ? 65 : 62;
  }

  /**
   * Calcula quando uma pessoa poderá se aposentar por idade e
   * ter direito ao benefício integral de acordo com o regime atual
   *
   * @param {String} gender: homem ou mulher
   * @param {Integer} age: idade no ano corrente
   * @param {Integer} contribution: tempo de contribuição no ano corrente
   *
   * @return {Object}: quanto tempo falta, idade, ano e valor do benefício
   */
  const calculateNewByAge = function calculateNewByAge(gender, age, contribution, round = true) {
    /**
     * Idade mínima para poder se aposentar por idade
     */
    const minAge = minAgeNew(gender);

    /**
     * Contribuição mínima para benefício integral por idade
     * no regime atual é de 30 anos para ambos os sexos
     */
    const minContribution = 40;

    /**
     * Quantidade de anos necessária para aposentar com benefício integral
     */
    let debt;

    /**
     * Se o tempo de contribuição for maior ou igual a 30 anos,
     * calcula a diferença entre a idade mínima e a idade atual
     */
    if (contribution >= minContribution) {
      debt = minAge - age;
    } else {
      /**
       * Calcula quantos anos faltam para atingir 30 de contribuição
       */
      debt = minContribution - contribution;

      /**
       * Calcula a idade que a pessoa teria ao somar este débito
       */
      let newAge = age + debt;

      /**
       * Se esta nova idade for menor que a mínima,
       * adiciona a diferença ao débito
       */
      if (newAge < minAge) {
        debt += minAge - newAge;
      }
    }

    // TODO: considerar caso de aposentadoria compulsória

    /**
     * O débito não pode ser negativo
     */
    debt = Math.max(0, debt);


    /**
     * Arredonda o débito
     */
    if (round) {
      debt = Math.round(debt);
    }

    /**
     * Valor do benefício
     */
    // TODO: multiplicar pelo fator previdenciário quando necessário
    const value = Math.min(100, 70 + contribution + debt);

    /**
     * Retorna quantos anos faltam, valor do benefício, idade,
     * tempo de contribuição e ano que poderá se aposentar recebendo
     * o benefício integral ou o maior valor possível em caso de
     * aposentadoria compusória
     */
    return {
      debt: Math.min(debt, 40),
      value,
      age: age + debt,
      contribution: contribution + debt,
      points: age + contribution + debt * 2,
      year: currentYear + debt,
    };
  };

  window.result = function result(gender, age, contribution = 0, hasContribution = true, round = true) {
    let oldRules;
    let newRules;
    /**
     * Calcula o menor entre idade e pontos para a regra atual
     */

    const currentByAge = calculateCurrentByAge(gender, age, contribution);
    const currentByPoints = calculateCurrentByPoints(gender, age, contribution);

    oldRules = currentByPoints.age < currentByAge.age ? currentByPoints : currentByAge;

    /**
     * Se tem contribuição antes da reforma, utiliza a regra de transição
     */
    if (hasContribution) {
      const transitionByAge = calculateTransitionByAge(gender, age, contribution);
      const transitionByPoints = calculateTransitionByPoints(gender, age, contribution);

      newRules = transitionByPoints.age < transitionByAge.age ? transitionByPoints : transitionByAge;
    } else {
      newRules = calculateNewByAge(gender, age, contribution);
    }

    return {
      oldRules,
      newRules,
    };
  };
}());
