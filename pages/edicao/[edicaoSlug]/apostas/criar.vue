<script setup>
const route = useRoute();

// Form data
const state = reactive({
  name: undefined,
  cpf: undefined,
  currentNumber: undefined,
  numbers: [],
});

function goBack() {
  navigateTo(`/edicao/${route.params.edicaoSlug}`);
}

// Adding numbers between 1 and 50 to the list select by the user
function addNumber() {
  if (state.numbers.length < 5) {
    if (state.currentNumber > 0 && state.currentNumber < 51) {
      state.numbers.push(state.currentNumber);
    }
  }
}

function removeNumber(index) {
  state.numbers.splice(index, 1);
}

function surpresinha() {
  state.numbers = [];
  for (let i = 0; i < 5; i++) {
    state.numbers.push(Math.floor(Math.random() * 50) + 1);
  }
}

async function criarAposta() {
  console.log(state);

  const { data } = await useFetch("/api/aposta/postNewAposta", {
    method: "POST",
    body: JSON.stringify({
      edicao_id: route.params.edicaoSlug,
      cpf: state.cpf,
      name: state.name,
      numbers: state.numbers,
    }),
  });

  console.log(data);
}
</script>

<template>
  <UContainer class="h-screen flex p-8 gap-3 flex-col">
    <div class="flex items-center gap-5">
      <UButton variant="link" size="sm" @click="goBack"> Voltar </UButton>
      <h1 class="my-7 text-2xl">Criar aposta</h1>
    </div>
    <div class="max-w-md flex flex-col gap-5">
      <UFormGroup label="Nome" required size="xl">
        <UInput placeholder="John Doe" type="text" v-model="state.name" />
      </UFormGroup>
      <UFormGroup label="CPF" required size="xl">
        <UInput
          placeholder="123.456.789-00"
          type="text"
          v-model="state.cpf"
          maxlength="14"
        />
      </UFormGroup>
      <UFormGroup
        label="Número"
        required
        size="xl"
        hint="para remover um número, clique em cima dele"
      >
        <UInput
          placeholder="23"
          min="1"
          max="50"
          pattern="\d{1,2}|50"
          type="number"
          v-model="state.currentNumber"
        />
      </UFormGroup>
      <UButton variant="link" class="correction_button" @click="addNumber">
        Adicionar número
      </UButton>

      <div class="mb-5">
        <UKbd
          v-for="(number, index) in state.numbers"
          :key="index"
          class="mr-4 cursor-pointer"
          size="md"
          @click="removeNumber(index)"
          >{{ number }}</UKbd
        >
      </div>
      <div class="flex gap-5">
        <UButton
          variant="outline"
          size="sm"
          @click="surpresinha"
          class="correction_button"
        >
          Supresinha
        </UButton>
        <UButton
          variant="solid"
          size="sm"
          @click="criarAposta"
          class="correction_button"
        >
          Criar
        </UButton>
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
.correction_button {
  width: max-content;
  padding: 12px;
}
</style>
