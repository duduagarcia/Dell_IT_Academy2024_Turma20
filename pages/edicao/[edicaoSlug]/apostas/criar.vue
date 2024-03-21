<!-- Página de criação de uma determinada aposta -->
<script setup>
const route = useRoute();
const toast = useToast();

// Dados do formulário
const state = reactive({
  name: "",
  cpf: "",
  currentNumber: undefined,
  numbers: [],
});

function goBack() {
  navigateTo(`/edicao/${route.params.edicaoSlug}`);
}

async function criarAposta() {
  const { data } = await useFetch("/api/aposta/postNewAposta", {
    method: "POST",
    body: JSON.stringify({
      edicao_id: route.params.edicaoSlug,
      cpf: state.cpf,
      name: state.name,
      numbers: state.numbers,
    }),
  });

  // Após salvar a aposta no banco, zeramos os dados do input para que o usuário possa fazer uma nova aposta
  if (data.value.status === 200) {
    toast.add({
      title: "Aposta criada com sucesso",
      description: "Agora é só torcer!",
    });
    state.cpf = "";
    state.name = "";
    state.numbers = [];
    state.currentNumber = undefined;
  } else {
    toast.add({
      title: "Erro ao criar aposta",
      description: "Tente novamente mais tarde",
      color: "red",
    });
  }
}

// Máscara de formatação de CPF
const inputCPF = ref(null);
function formatCPF() {
  state.cpf = state.cpf.replace(/[^\d]/g, "");
  verifyCPF();

  state.cpf = state.cpf.replace(/\D/g, "");
  state.cpf = state.cpf.replace(/(\d{3})(\d)/, "$1.$2");
  state.cpf = state.cpf.replace(/(\d{3})(\d)/, "$1.$2");
  state.cpf = state.cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function verifyCPF() {
  if (state.cpf.length === 11) {
    inputCPF.value.style.border = "1px solid #333d4d";
  } else {
    inputCPF.value.style.border = "1px solid red";
  }
  watchFormControl();
}

// Lógica do input de números
const inputNumber = ref(null); // reference to the HTML element with vue `ref`
const lockNumberChange = ref(true);
function verifyNumber() {
  if (state.currentNumber > 0 && state.currentNumber < 51) {
    inputNumber.value.style.border = "1px solid #333d4d";
    lockNumberChange.value = false;
  } else {
    inputNumber.value.style.border = "1px solid red";
    lockNumberChange.value = true;
  }
  watchFormControl();
}

function addNumber() {
  if (state.numbers.length < 5) {
    if (state.currentNumber > 0 && state.currentNumber < 51) {
      state.numbers.push(state.currentNumber);
      state.currentNumber = undefined;
      lockNumberChange.value = true;
    }
  }
  watchFormControl();
}

function removeNumber(index) {
  state.numbers.splice(index, 1);
  watchFormControl();
}

// Gerador de números aleatórios entre 1 e 50
function surpresinha() {
  state.numbers = [];
  for (let i = 0; i < 5; i++) {
    state.numbers.push(Math.floor(Math.random() * 50) + 1);
  }
  watchFormControl();
}

// Lógica de controle do formulário, que será ativada sempre que algum input for modificado
const formControl = ref(false);
function watchFormControl() {
  // Verifica se todos os campos estão preenchidos nos seus devidos padrões

  // OBS: aqui encontrei um problema com a minha máscara de CPF, que faz com que o tamanho do CPF seja 14 (###.###.###-##) ou 11 (###########)
  if (
    state.name &&
    (state.cpf.length === 11 || state.cpf.length === 14) &&
    state.numbers.length === 5
  ) {
    formControl.value = true;
  } else {
    formControl.value = false;
  }
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
        <input
          class="w-full p-3 outline-none rounded-md input-border"
          type="text"
          v-model="state.name"
          placeholder="John Doe"
          @input="watchFormControl"
        />
      </UFormGroup>
      <UFormGroup label="CPF" required size="xl">
        <input
          class="w-full p-3 outline-none rounded-md input-border"
          type="text"
          v-model="state.cpf"
          @input="formatCPF()"
          maxlength="14"
          placeholder="123.456.789-00"
          ref="inputCPF"
        />
      </UFormGroup>

      <UFormGroup
        label="Número"
        required
        size="xl"
        hint="para remover um número, clique em cima dele"
      >
        <input
          class="w-full p-3 outline-none rounded-md input-border"
          placeholder="23"
          min="1"
          max="50"
          pattern="\d{1,2}|50"
          type="number"
          v-model="state.currentNumber"
          @input="verifyNumber"
          ref="inputNumber"
          :class="state.numbers.length == 5 ? 'disable' : ''"
        />
      </UFormGroup>
      <UButton
        variant="link"
        class="correction_button"
        @click="addNumber"
        label="Adicionar número"
        :class="lockNumberChange ? 'disable' : ''"
      />

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
          :class="!formControl ? 'disable' : ''"
          label="Criar"
        />
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
.correction_button {
  width: max-content;
  padding: 12px;
}

.input-border {
  border: 1px solid #333d4d;
}

.disable {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
