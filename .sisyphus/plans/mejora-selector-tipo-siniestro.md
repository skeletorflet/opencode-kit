# Plan: Mejora de App Denuncia de Seguros - Selector de Tipo de Siniestro

## TL;DR

> **Resumen Rápido**: Agregar selector de tipo de siniestro (ROBO | INCENDIO | CRISTALES | ACCIDENTE) como Paso 0, con campos específicos obligatorios para cada tipo. UI en grid de 4 botones grandes.

> **Entregables**:
> - Componente TypeSelector con 4 botones grandes
> - Campos específicos para ROBO (denuncia policial, items, etc.)
> - Campos específicos para INCENDIO (bomberos SI/NO)
> - Validaciones específicas para CRISTALES y ACCIDENTE
> - Integración con flujo existente de 3 pasos

> **Esfuerzo Estimado**: Medium-Large
> **Ejecución Paralela**: YES - 3 waves
> **Ruta Crítica**: Step 0 → Schema → Step 1 → Validations → QA

---

## Contexto

### Solicitud Original
Mejorar la app de denuncia de seguros con selector de tipo de siniestro, donde cada tipo tenga campos obligatorios específicos.

### Resumen de Entrevista

**Decisiones del Cliente**:
- Selector como Paso 0 (antes del formulario)
- Grid de 4 botones grandes (2x2)
- ROBO: Denuncia policial obligatoria + fecha/hora/lugar + items (medida, marca, descripción)
- INCENDIO: ¿Hubo bomberos? (SI/NO simple)
- CRISTALES: Foto close-up + foto con patente visible
- ACCIDENTE: Datos tercero obligatorios (excepto "no tengo") + fotos cédula/licencia (frente+reverso) + recomendación croquis

** Hallazgos de Investigación**:
- Stack: Next.js + React + TypeScript + Tailwind + Zustand
- ClaimForm actual con 3 pasos y react-hook-form + zod
- SketchModal ya existe para croquis

### Revisión Metis

**Brechas Identificadas** (atendidas):
- Comportamiento al cambiar tipo en medio del formulario
- Sket
- Multiples terceros en ACCIDENTE
- Límite de items en ROBO

---

## Objetivos de Trabajo

### Objetivo Principal
Implementar selector de tipo de siniestro con campos específicos obligatorios para ROBO, INCENDIO, CRISTALES y ACCIDENTE.

### Entregables Concretos
1. TypeSelector component con 4 botones (grid 2x2)
2. Zod schema expandido con campos por tipo
3. Step 1 actualizado con campos condicionales según tipo
4. Validaciones específicas por tipo de siniestro
5. Recomendación de croquis para ACCIDENTE

### Definición de Done
- [ ] Selector de tipo visible como paso inicial
- [ ] Cada tipo muestra campos específicos
- [ ] ROBO: Denuncia policial requerida
- [ ] ACCIDENTE: Fotos ID/license obligatorias
- [ ] Croquis disponible para ACCIDENTE

### DebeTener
- Selector de tipo antes del formulario
- Campos específicos por tipo
- Validaciones obligatorias

### NoDebeTener (Guardrails)
- Más de 4 tipos de siniestro
- Cambios en backend/envío de email
- Modificar SketchModal.tsx existente (solo agregar acceso)

---

## Estrategia de Verificación

> **CERO INTERVENCIÓN HUMANA** - Toda verificación es agente-ejecutada. No excepciones.

### Decisión de Tests
- **Infraestructura existe**: YES
- **Tests automatizados**: NO (QA agente-ejecutado)
- **Framework**: N/A

### Política QA
Cada tarea debe incluir escenarios de QA ejecutados por agente (ver sección TODO template).

---

## Estrategia de Ejecución

### Ondas de Ejecución Paralela

```
Onda 1 (Inicio inmediato - base + config):
├── Tarea 1: Actualizar Zod schema con campos de tipo de siniestro
├── Tarea 2: Agregar tipo de siniestro al store de Zustand
├── Tarea 3: Crear TypeSelector component
└── Tarea 4: Integrar TypeSelector como Paso 0

Onda 2 (Después de Onda 1 - componentes específicos):
├── Tarea 5: Agregar campos ROBO al formulario (Step 1)
├── Tarea 6: Agregar campos INCENDIO al formulario (Step 1)
├── Tarea 7: Agregar campos CRISTALES al formulario (Step 1)
├── Tarea 8: Agregar campos ACCIDENTE al formulario (Step 1)
├── Tarea 9: Validaciones específicas por tipo (Zod)
└── Tarea 10: Recomendación de croquis para ACCIDENTE

Onda 3 (Después de Onda 2 - integración + QA):
├── Tarea 11: Integrar con pasos existentes (Step 2 y 3)
├── Tarea 12: Testing de flujos completos por tipo
├── Tarea 13: Ajustes responsive del TypeSelector
└── Tarea 14: QA final y ajustes visuales
```

### Dependencias
- 1-4 → 5-10 → 11-14

---

## TODOs

- [ ] 1. Actualizar Zod schema con campos de tipo de siniestro

  **Qué hacer**:
  - Agregar campo `claimType` al schema existente (ROBO | INCENDIO | CRISTALES | ACCIDENTE)
  - Agregar campos condicionales según el tipo seleccionado
  - ROBO: `policeReportDate`, `policeReportTime`, `policeReportLocation`, `stolenItems[]`
  - INCENDIO: `firefightersIntervened` (boolean)
  - ACCIDENTE: `noThirdPartyData` (boolean), requiere photos extras
  - Mantener backward compatibility con campos existentes

  **No debe hacer**:
  - Eliminar campos existentes del schema
  - Agregar más de 4 tipos de siniestro

  **Perfil de agente recomendado**:
  - **Categoría**: `ultrabrain`
  - **Razón**: Necesita modificar schema Zod con validaciones complejas condicionales
  - **Habilidades**: `["clean-code", "form-patterns"]`

  **Paralelización**:
  - **Puede ejecutar en paralelo**: SI
  - **Onda**: 1 (con Tareas 2, 3, 4)
  - **Bloquea**: Tareas 5-10
  - **Bloqueado por**: Ninguna

  **Referencias**:
  - `components/ClaimForm.tsx:48-118` - Schema Zod actual
  - Tipos de Zod: `https://zod.dev/?id=superrefine`

  **Criterios de aceptación**:
  - [ ] Schema incluye `claimType` como required
  - [ ] Campos ROBO aparecen cuando claimType === 'ROBO'
  - [ ] Campos INCENDIO aparecen cuando claimType === 'INCENDIO'
  - [ ] Campos ACCIDENTE aparecen cuando claimType === 'ACCIDENTE'

  **Escenarios QA**:
  - Seleccionar ROBO → Verificar campos policial aparecen
  - Seleccionar INCENDIO → Verificar toggle bomberos aparece
  - Seleccionar ACCIDENTE → Verificar opción "no tengo datos" aparece

- [ ] 2. Agregar tipo de siniestro al store de Zustand

  **Qué hacer**:
  - Agregar campo `claimType` al ClaimFormState en `store/claimForm.ts`
  - Agregar setter `setClaimType(type: ClaimType)`
  - Persistir el tipo junto con el draft

  **No debe hacer**:
  - Modificar lógica de persistencia existente
  - Agregar estados adicionales al store

  **Perfil de agente recomendado**:
  - **Categoría**: `quick`
  - **Razón**: Cambio simple en store Zustand existente
  - **Habilidades**: `["state-management"]`

  **Paralelización**:
  - **Puede ejecutar en paralelo**: SI
  - **Onda**: 1 (con Tareas 1, 3, 4)
  - **Bloquea**: Tareas 5-10
  - **Bloqueado por**: Ninguna

  **Referencias**:
  - `store/claimForm.ts:1-54` - Store actual

  **Criterios de aceptación**:
  - [ ] Store tiene claimType
  - [ ] setClaimType funciona correctamente

- [ ] 3. Crear TypeSelector component

  **Qué hacer**:
  - Crear nuevo componente `TypeSelector.tsx`
  - Grid 2x2 con 4 botones grandes
  - Cada botón con icono representativo:
    - ROBO: 🏴‍☠️ o icono de robo
    - INCENDIO: 🔥 o flama
    - CRISTALES: 💔 o vidrio
    - ACCIDENTE: 💥 o choque
  - Colores distintivos por tipo:
    - ROBO: rojo
    - INCENDIO: naranja
    - CRISTALES: azul
    - ACCIDENTE: verde
  - Efecto visual al seleccionar (border highlight)
  - Responsive: grid 2x2 en desktop, 1 columna en mobile

  **No debe hacer**:
  - Usar colores violeta/purple (prohibido por diseño)
  - Crear layout diferente al especificado

  **Perfil de agente recomendado**:
  - **Categoría**: `visual-engineering`
  - **Razón**: UI con grid, iconos y animaciones
  - **Habilidades**: `["frontend-design", "tailwind-patterns"]`

  **Paralelización**:
  - **Puede ejecutar en paralelo**: SI
  - **Onda**: 1 (con Tareas 1, 2, 4)
  - **Bloquea**: Tareas 5-10
  - **Bloqueado por**: Ninguna

  **Referencias**:
  - `components/ui/button.tsx` - Componente botón existente
  - `components/ClaimForm.tsx:582-674` - Header con step indicator (referencia de estilo)
  - Iconos Lucide React: https://lucide.dev/icons

  **Criterios de aceptación**:
  - [ ] 4 botones visibles en grid 2x2 (desktop)
  - [ ] Botones apilados en mobile
  - [ ] Cada tipo tiene color distintivo
  - [ ] Click en tipo selecciona y avanza al paso 1

  **Escenarios QA**:
  - Grid 2x2 visible en desktop (≥768px)
  - Botones apilados en mobile (<768px)
  - Click ROBO selecciona tipo y muestra campos ROBO
  - Selected type tiene highlight visual

- [ ] 4. Integrar TypeSelector como Paso 0

  **Qué hacer**:
  - Modificar ClaimForm.tsx para mostrar TypeSelector al inicio
  - Agregar estado `currentStep` que inicie en 0 (selector)
  - Cuando step > 0, mostrar progress indicator con 4 pasos
  - Cuando step === 0, mostrar solo TypeSelector
  - Navigation: No permitir avanzar sin seleccionar tipo
  - Persistir tipo seleccionado en Zustand

  **No debe hacer**:
  - Modificar lógica de pasos existentes
  - Cambiar orden de pasos 1-3

  **Perfil de agente recomendado**:
  - **Categoría**: `visual-engineering`
  - **Razón**: Integración con flujo de pasos existente
  - **Habilidades**: `["react-best-practices", "form-patterns"]`

  **Paralelización**:
  - **Peut ejecutar en paralelo**: SI
  - **Onda**: 1 (con Tareas 1, 2, 3)
  - **Bloquea**: Tareas 5-10
  - **Bloqueado por**: Tareas 1, 2, 3 (completion)

  **Referencias**:
  - `components/ClaimForm.tsx:147-150` - Estado currentStep
  - `components/ClaimForm.tsx:620-671` - Step indicator existente

  **Criterios de aceptación**:
  - [ ] TypeSelector visible al iniciar formulario
  - [ ] Progress indicator muestra pasos 1-4 cuando tipo seleccionado
  - [ ] No puede avanzar sin seleccionar tipo

  **Escenarios QA**:
  - Abrir app → Ver TypeSelector (Step 0)
  - Seleccionar tipo → Ver progress indicator con 4 pasos
  - Click "Anterior" desde Step 1 → Permite cambiar tipo

- [ ] 5. Agregar campos ROBO al formulario (Step 1)

  **Qué hacer**:
  - Agregar sección condicional cuando claimType === 'ROBO'
  - Campos requeridos:
    - `hasPoliceReport`: boolean (siempre true, checkbox de confirmación)
    - `policeReportNumber`: string (número de denuncia)
    - `policeReportDate`: date
    - `policeReportTime`: time
    - `policeReportLocation`: string (lugar del robo)
    - `stolenItems`: array de objetos { measure, brand, description }
  - Validación: Todos los campos son obligatorios
  - UI: Agregar botón "Agregar item" para múltiples items

  **No debe hacer**:
  - Agregar campos no especificados por el cliente
  - Modificar campos existentes del Step 1

  **Perfil de agente recomendado**:
  - **Categoría**: `visual-engineering`
  - **Razón**: Formulario con campos dinámicos
  - **Habilidades**: `["form-patterns", "react-best-practices"]`

  **Paralelización**:
  - **Peut ejecutar en paralelo**: SI
  - **Onda**: 2 (con Tareas 6, 7, 8, 9, 10)
  - **Bloquea**: Ninguna
  - **Bloqueado por**: Tareas 1, 2, 3, 4

  **Referencias**:
  - `components/ClaimForm.tsx:704-810` - Vehicle section (referencia de estilo)
  - `components/ui/button.tsx` - Botón agregar
  - `components/ui/input.tsx` - Input fields

  **Criterios de aceptación**:
  - [ ] Campos ROBO visibles solo cuando claimType === 'ROBO'
  - [ ] Validación: no permite avanzar sin denuncia policial
  - [ ] Permite agregar múltiples items robados

  **Escenarios QA**:
  - Seleccionar ROBO → Ver campos policial
  - Dejar campo vacío → Mostrar error de validación
  - Agregar 3 items → Todos se guardan correctamente

- [ ] 6. Agregar campos INCENDIO al formulario (Step 1)

  **Qué hacer**:
  - Agregar sección condicional cuando claimType === 'INCENDIO'
  - Campos:
    - `firefightersIntervened`: boolean (SI/NO toggle)
    - `fireDescription`: text (origen del incendio)
  - Validación: Si toggle es SI, considerar obligatorio incluir descripción

  **No debe hacer**:
  - Agregar campos de bomberos más allá de lo especificado
  - Modificar estructura de otros tipos

  **Perfil de agente recomendado**:
  - **Categoría**: `quick`
  - **Razón**: Campos simples, solo toggle + textarea
  - **Habilidades**: `["form-patterns"]`

  **Paralelización**:
  - **Puede ejecutar en paralelo**: SI
  - **Onda**: 2 (con Tareas 5, 7, 8, 9, 10)
  - **Bloquea**: Ninguna
  - **Bloqueado por**: Tareas 1, 2, 3, 4

  **Criterios de aceptación**:
  - [ ] Campos INCENDIO visibles solo cuando claimType === 'INCENDIO'
  - [ ] Toggle SI/NO funciona correctamente

  **Escenarios QA**:
  - Seleccionar INCENDIO → Ver toggle bomberos
  - Toggle SI → Mostrar campo descripción
  - Toggle NO → Ocultar campo descripción

- [ ] 7. Agregar campos CRISTALES al formulario (Step 1)

  **Qué hacer**:
  - Agregar sección condicional cuando claimType === 'CRISTALES'
  - No hay campos de entrada específicos (la especificación es sobre fotos)
  - Agregar helper text indicando requisitos de foto:
    - "Foto close-up del cristal dañado"
    - "Foto de distancia donde se vea la patente"
  - Esta validación se maneja en el paso de documentación (Step 3)

  **No debe hacer**:
  - Agregar campos de entrada más allá de helper text
  - Modificar flujo de fotos existente

  **Perfil de agente recomendado**:
  - **Categoría**: `quick`
  - **Razón**: Solo UI helper, sin lógica de formulario
  - **Habilidades**: `["frontend-design"]`

  **Paralelización**:
  - **Peut ejecutar en paralelo**: SI
  - **Onda**: 2 (con Tareas 5, 6, 8, 9, 10)
  - **Bloquea**: Ninguna
  - **Bloqueado por**: Tareas 1, 2, 3, 4

  **Criterios de aceptación**:
  - [ ] Helper text visible solo cuando claimType === 'CRISTALES'
  - [ ] Requisitos de foto claramente especificados

  **Escenarios QA**:
  - Seleccionar CRISTALES → Ver requisitos de foto en Step 1
  - En Step 3, validar que pide las 2 fotos específicas

- [ ] 8. Agregar campos ACCIDENTE al formulario (Step 1)

  **Qué hacer**:
  - Agregar sección condicional cuando claimType === 'ACCIDENTE'
  - Agregar toggle "No tengo los datos del tercero"
  - Cuando toggle está activo: campos de tercero son opcionales
  - Cuando toggle está inactivo: campos de tercero son obligatorios
  - Agregar sección para fotos obligatorias:
    - Foto Cédula (frente + reverso)
    - Foto Licencia (frente + reverso)
  - Esta validación se maneja en Step 3

  **No debe hacer**:
  - Hacer campos de tercero opcionales por defecto
  - Modificar lógica existente de terceros

  **Perfil de agente recomendado**:
  - **Categoría**: `visual-engineering`
  - **Razón**: Lógica condicional para campos terceros
  - **Habilidades**: `["form-patterns"]`

  **Paralelización**:
  - **Peut ejecutar en paralelo**: SI
  - **Onda**: 2 (con Tareas 5, 6, 7, 9, 10)
  - **Bloquea**: Ninguna
  - **Bloqueado por**: Tareas 1, 2, 3, 4

  **Criterios de aceptación**:
  - [ ] Toggle "No tengo los datos" visible cuando claimType === 'ACCIDENTE'
  - [ ] Si toggle activo, campos terceros son opcionales
  - [ ] Si toggle inactivo, campos terceros son obligatorios

  **Escenarios QA**:
  - Seleccionar ACCIDENTE → Ver toggle
  - Toggle activo → Puede avanzar sin datos tercero
  - Toggle inactivo → Must fill datos tercero para avanzar

- [ ] 9. Validaciones específicas por tipo (Zod)

  **Qué hacer**:
  - Actualizar Zod schema con validaciones condicionales
  - ROBO: policeReportNumber obligatorio, al menos 1 stolenItem
  - INCENDIO: fireDescription obligatorio si firefightersIntervened === true
  - ACCIDENTE: third party fields optional si noThirdPartyData === true
  - CRISTALES: validación de fotos en Step 3 (mínimo 2 fotos, una close-up, una con patente)
  - Usar superRefine para validaciones condicionales complejas

  **No debe hacer**:
  - Eliminar validaciones existentes
  - Agregar validaciones más allá de lo especificado

  **Perfil de agente recomendado**:
  - **Categoría**: `ultrabrain`
  - **Razón**: Validaciones Zod complejas y condicionales
  - **Habilidades**: `["form-patterns", "clean-code"]`

  **Paralelización**:
  - **Peut ejecutar en paralelo**: SI
  - **Onda**: 2 (con Tareas 5, 6, 7, 8, 10)
  - **Bloquea**: Ninguna
  - **Bloqueado por**: Tareas 1, 2, 3, 4

  **Referencias**:
  - `components/ClaimForm.tsx:89-118` - superRefine ejemplo actual
  - Doc Zod: https://zod.dev/?id=superrefine

  **Criterios de aceptación**:
  - [ ] Validación ROBO no permite avanzar sin denuncia policial
  - [ ] Validación ACCIDENde permite avanzar si "no tengo datos"
  - [ ] Errores de validación visibles inline

  **Escenarios QA**:
  - ROBO sin items → Error "Agregue al menos un item"
  - ACCIDENTE sin datos y sin toggle → Error en campos terceros
  - Validación muestra mensajes claros

- [ ] 10. Recomendación de croquis para ACCIDENTE

  **Qué hacer**:
  - Agregar mensaje de recomendación de croquis en Step 1 cuando claimType === 'ACCIDENTE'
  - Mostrar después de campos de tercero
  - Texto: "Recomendamos realizar un croquis del accidente. Puede hacerlo desde la sección de documentación."
  - Agregar link/botón para abrir SketchModal desde Step 1
  - El croquis es SOLO recomendado, no obligatorio

  **No debe hacer**:
  - Hacer el croquis obligatorio
  - Modificar SketchModal existente

  **Perfil de agente recomendado**:
  - **Categoría**: `visual-engineering`
  - **Razón**: UI con recomendaciones y acceso a modal
  - **Habilidades**: `["frontend-design"]`

  **Paralelización**:
  - **Peut ejecutar en paralelo**: SI
  - **Onda**: 2 (con Tareas 5, 6, 7, 8, 9)
  - **Bloquea**: Ninguna
  - **Bloqueado por**: Tareas 1, 2, 3, 4

  **Referencias**:
  - `components/sketch/SketchModal.tsx` - Modal existente
  - `components/ClaimForm.tsx:1036-1045` - Ejemplo de alerta/warning

  **Criterios de aceptación**:
  - [ ] Mensaje visible solo cuando claimType === 'ACCIDENTE'
  - [ ] Botón abre SketchModal
  - [ ] Es solo recomendación, no bloquea avance

  **Escenarios QA**:
  - ACCIDENTE → Ver mensaje recomendación croquis
  - Click "Hacer croquis" → Abre SketchModal
  - Cerrar croquis → Continúa formulario normalmente

- [ ] 11. Integrar con pasos existentes (Step 2 y 3)

  **Qué hacer**:
  - Asegurar que campos de Step 2 y 3 funcionen correctamente con nuevo claimType
  - Step 2: Terceros y lesiones (ya funciona, agregar lógica según tipo)
  - Step 3: Documentación - agregar validaciones específicas por tipo
  - CRISTALES: Validar subir al menos 2 fotos (close-up + distancia)
  - ACCIDENTE: Validar fotos de cédula y licencia (frente + reverso = 4 fotos)
  - Mantener flujo existente para ROBO e INCENDIO

  **No debe hacer**:
  - Modificar lógica de pasos existentes más allá de lo necesario
  - Cambiar estructura de FileUploadModern

  **Perfil de agente recomendado**:
  - **Categoría**: `visual-engineering`
  - **Razón**: Integración con flujos existentes
  - **Habilidades**: `["react-best-practices"]`

  **Paralelización**:
  - **Peut ejecutar en paralelo**: NO
  - **Onda**: 3 (con Tareas 12, 13, 14)
  - **Bloquea**: Ninguna
  - **Bloqueado por**: Tareas 5-10

  **Referencias**:
  - `components/ClaimForm.tsx:870-1052` - Step 2 actual
  - `components/ClaimForm.tsx:1054-1115` - Step 3 actual
  - `components/forms/FileUploadModern.tsx` - Componente de upload

  **Criterios de aceptación**:
  - [ ] Step 2 funciona con todos los tipos
  - [ ] CRISTALES: requiere 2+ fotos en Step 3
  - [ ] ACCIDENTE: requiere 4 fotos (cédula+licencia frente+reverso)

  **Escenarios QA**:
  - CRISTALES: Subir solo 1 foto → Error
  - ACCIDENTE: Subir solo 2 fotos → Error
  - ROBO/INCENDIO: Flujo normal como antes

- [ ] 12. Testing de flujos completos por tipo

  **Qué hacer**:
  - Ejecutar flujo completo para cada tipo de siniestro:
    - Flujo ROBO: selector → datos → policial → items → submit
    - Flujo INCENDIO: selector → datos → bomberos → submit
    - Flujo CRISTALES: selector → datos → fotos → submit
    - Flujo ACCIDENTE: selector → datos → tercero → fotos → croquis → submit
  - Verificar que cada flujo permita avanzar y guardar correctamente
  - Verificar que validaciones funcionen en cada paso

  **No debe hacer**:
  - Modificar código durante testing
  - Saltar tipos de prueba

  **Perfil de agente recomendado**:
  - **Categoría**: `unspecified-high`
  - **Razón**: Testing end-to-end de todos los flujos
  - **Habilidades**: `["webapp-testing"]`

  **Paralelización**:
  - **Peut ejecutar en paralelo**: NO
  - **Onda**: 3 (con Tareas 11, 13, 14)
  - **Bloquea**: Ninguna
  - **Bloqueado por**: Tareas 5-10

  **Escenarios QA**:
  - Flujo ROBO completo → Submit exitoso
  - Flujo INCENDIO completo → Submit exitoso
  - Flujo CRISTALES completo → Submit exitoso
  - Flujo ACCIDENTE completo → Submit exitoso

- [ ] 13. Ajustes responsive del TypeSelector

  **Qué hacer**:
  - Verificar que TypeSelector se vea bien en todos los tamaños:
    - Mobile (< 640px): 1 columna
    - Tablet (640px - 1024px): grid 2x2
    - Desktop (> 1024px): grid 2x2 con más espacio
  - Ajustar tamaños de botones y tipografía
  - Verificar que iconos sean visibles y bien proporcinados
  - Testing en DevTools con diferentes viewports

  **No debe hacer**:
  - Cambiar layout por defecto (grid 2x2)
  - Agregar breakpoints no especificados

  **Perfil de agente recomendado**:
  - **Categoría**: `visual-engineering`
  - **Razón**: Ajustes responsive específicos
  - **Habilidades**: `["tailwind-patterns", "frontend-design"]`

  **Paralelización**:
  - **Peut ejecutar en paralelo**: NO
  - **Onda**: 3 (con Tareas 11, 12, 14)
  - **Bloquea**: Ninguna
  - **Bloqueado por**: Tareas 5-10

  **Escenarios QA**:
  - Mobile: Botones apilados verticalmente
  - Tablet: Grid 2x2
  - Desktop: Grid 2x2 con spacing adecuado

- [ ] 14. QA final y ajustes visuales

  **Qué hacer**:
  - Revisión visual completa del formulario con nuevo TypeSelector
  - Verificar consistencia de colores y tipografía
  - Verificar que transiciones entre pasos sean fluidas
  - Ajustar cualquier detalle visual que no cumpla con estándares
  - Verificar que mensajes de error sean claros y visibles
  - Testing en browser real (no solo DevTools)

  **No debe hacer**:
  - Cambiar comportamiento funcional
  - Agregar nuevas features

  **Perfil de agente recomendado**:
  - **Categoría**: `unspecified-high`
  - **Razón**: QA visual final
  - **Habilidades**: `["web-design-guidelines"]`

  **Paralelización**:
  - **Peut ejecutar en paralelo**: NO
  - **Onda**: 3 (con Tareas 11, 12, 13)
  - **Bloquea**: Ninguna
  - **Bloqueado por**: Tareas 5-10

  **Escenarios QA**:
  - Vista general: Todos los tipos funcionan
  - Colores: Consistencia en toda la app
  - Errores: Mensajes claros y visibles
  - Animaciones: Transiciones suaves entre pasos

---

## Onda de Verificación Final

- [ ] F1. Auditoría de Cumplimiento del Plan — `oracle`
- [ ] F2. Revisión de Calidad de Código — `unspecified-high`
- [ ] F3. QA Manual Real — `unspecified-high`
- [ ] F4. Verificación de Fidelidad de Scope — `deep`

---

## Estrategia de Commits

- **Commit 1**: `feat(claim-form): add claim type selector step 0`
- **Commit 2**: `feat(claim-form): add ROBO specific fields`
- **Commit 3**: `feat(claim-form): add INCENDIO and CRISTALES fields`
- **Commit 4**: `feat(claim-form): add ACCIDENTE specific fields`
- **Commit 5**: `feat(claim-form): integrate with existing steps and finalize`

---

## Criterios de Éxito

- [ ] TypeSelector visible como paso inicial
- [ ] 4 tipos de siniestro funcionan correctamente
- [ ] ROBO: Denuncia policial obligatoria
- [ ] INCENDIO: Toggle bomberos
- [ ] CRISTALES: Requisitos de foto
- [ ] ACCIDENTE: Datos tercero + fotos + croquis
- [ ] Build pasa sin errores
- [ ] Formulario funcional para todos los tipos

