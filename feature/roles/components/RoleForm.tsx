"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown, ChevronRight, Loader2, ShieldPlus } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AppHeader } from "@/layout/AppHeader"
import {
  roleFormSchema,
  type PermissionAction,
  type RoleFormValues,
} from "../types"
import type { Permission } from "../types"

type ModuleNode = {
  id: string
  name: string
  parentId: string | null
  children: Array<{ id: string; name: string; parentId: string | null }>
  actions: Partial<Record<PermissionAction, string>>
}

type PermissionGroup = ModuleNode & { childrenModules: ModuleNode[] }

const ACTIONS: PermissionAction[] = ["READ", "UPDATE", "CREATE", "DELETE"]

type RoleFormPayload = {
  name: string
  description: string
  permissionIds: string[]
}

type RoleFormProps = {
  title: string
  defaultValues?: { name: string; description: string; permissionIds: string[] }
  onSubmit?: (payload: RoleFormPayload) => void
  isPending?: boolean
  permissionData?: { data?: Permission[] }
  readOnly?: boolean
}

const RoleForm = ({
  title,
  defaultValues,
  onSubmit,
  isPending = false,
  permissionData,
  readOnly = false,
}: RoleFormProps) => {
  const router = useRouter()

  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [groupedPermissions, setGroupedPermissions] = useState<
    PermissionGroup[]
  >([])
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({})
  const [childOverrides, setChildOverrides] = useState<Record<string, boolean>>(
    {}
  )

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      permissionIds: [],
    },
  })

  // Build grouped permissions from API data
  useEffect(() => {
    if (!permissionData?.data) return

    const permissions = permissionData.data as Permission[]
    const moduleMap = new Map<string, ModuleNode>()

    permissions.forEach((item) => {
      const { module } = item
      if (!moduleMap.has(module.id)) {
        moduleMap.set(module.id, {
          id: module.id,
          name: module.name,
          parentId: module.parentId,
          children: module.children || [],
          actions: {},
        })
      }
      const existing = moduleMap.get(module.id)!
      existing.actions[item.action] = item.id
      if (module.children?.length) {
        existing.children = module.children
      }
    })

    const rootModules = Array.from(moduleMap.values()).filter(
      (m) => !m.parentId || !moduleMap.has(m.parentId)
    )

    const grouped = rootModules.map((root) => {
      const childrenFromParent = Array.from(moduleMap.values()).filter(
        (m) => m.parentId === root.id
      )
      const childrenFromRoot = (root.children || []).map(
        (child) =>
          moduleMap.get(child.id) || {
            id: child.id,
            name: child.name,
            parentId: child.parentId,
            children: [],
            actions: {},
          }
      )
      const mergedMap = new Map<string, ModuleNode>()
      ;[...childrenFromParent, ...childrenFromRoot].forEach((c) =>
        mergedMap.set(c.id, c)
      )

      return { ...root, childrenModules: Array.from(mergedMap.values()) }
    })

    setGroupedPermissions(grouped)
    setExpandedModules(
      grouped.reduce(
        (acc, g) => ({ ...acc, [g.id]: false }),
        {} as Record<string, boolean>
      )
    )
    setChildOverrides({})
  }, [permissionData])

  // Prefill form when defaultValues change (edit mode)
  useEffect(() => {
    if (!defaultValues) return
    form.reset(defaultValues)
    setSelectedPermissions(defaultValues.permissionIds)
  }, [defaultValues, form])

  // Permission helpers
  const toggleIds = (ids: string[], checked: boolean) => {
    setSelectedPermissions((prev) => {
      const set = new Set(prev)
      ids.forEach((id) => (checked ? set.add(id) : set.delete(id)))
      return Array.from(set)
    })
  }

  const getIdsByAction = (module: ModuleNode, action: PermissionAction) =>
    module.actions[action] ? [module.actions[action] as string] : []

  const getIdsForModuleAllAccess = (module: ModuleNode) =>
    ACTIONS.flatMap((a) => getIdsByAction(module, a))

  const getIdsForGroupByAction = (
    group: PermissionGroup,
    action: PermissionAction
  ) => [
    ...getIdsByAction(group, action),
    ...group.childrenModules.flatMap((c) => getIdsByAction(c, action)),
  ]

  const getIdsForGroupAllAccess = (group: PermissionGroup) => [
    ...getIdsForModuleAllAccess(group),
    ...group.childrenModules.flatMap((c) => getIdsForModuleAllAccess(c)),
  ]

  const isChecked = (ids: string[]) =>
    ids.length > 0 && ids.every((id) => selectedPermissions.includes(id))

  const getChildKey = (childId: string, action: PermissionAction) =>
    `${childId}:${action}`

  const getChildActionChecked = (
    child: ModuleNode,
    action: PermissionAction,
    parent: ModuleNode
  ) => {
    const childIds = getIdsByAction(child, action)
    if (childIds.length) return isChecked(childIds)
    const key = getChildKey(child.id, action)
    if (key in childOverrides) return childOverrides[key]
    return isChecked(getIdsByAction(parent, action))
  }

  const getChildAllAccessChecked = (child: ModuleNode, parent: ModuleNode) =>
    ACTIONS.every((a) => getChildActionChecked(child, a, parent))

  const toggleChildAction = (
    child: ModuleNode,
    action: PermissionAction,
    checked: boolean
  ) => {
    const childIds = getIdsByAction(child, action)
    if (childIds.length) {
      toggleIds(childIds, checked)
      return
    }
    setChildOverrides((prev) => ({
      ...prev,
      [getChildKey(child.id, action)]: checked,
    }))
  }

  const applyGroupActionToChildrenWithoutIds = (
    group: PermissionGroup,
    action: PermissionAction,
    checked: boolean
  ) => {
    setChildOverrides((prev) => {
      const next = { ...prev }
      group.childrenModules.forEach((child) => {
        if (getIdsByAction(child, action).length === 0) {
          next[getChildKey(child.id, action)] = checked
        }
      })
      return next
    })
  }

  const applyGroupAllToChildrenWithoutIds = (
    group: PermissionGroup,
    checked: boolean
  ) =>
    ACTIONS.forEach((a) =>
      applyGroupActionToChildrenWithoutIds(group, a, checked)
    )

  const effectivePermissionIds = useMemo(() => {
    const derived = new Set(selectedPermissions)
    groupedPermissions.forEach((group) => {
      ACTIONS.forEach((action) => {
        const parentIds = getIdsByAction(group, action)
        if (!parentIds.length) return
        const hasCheckedChildWithoutId = group.childrenModules.some(
          (child) =>
            getIdsByAction(child, action).length === 0 &&
            childOverrides[getChildKey(child.id, action)] === true
        )
        if (hasCheckedChildWithoutId) derived.add(parentIds[0])
      })
    })
    return Array.from(derived)
  }, [selectedPermissions, groupedPermissions, childOverrides])

  useEffect(() => {
    form.setValue("permissionIds", effectivePermissionIds, {
      shouldValidate: true,
    })
    if (effectivePermissionIds.length > 0) form.clearErrors("permissionIds")
  }, [effectivePermissionIds, form])

  const handleSubmit = (values: RoleFormValues) => {
    onSubmit?.({
      name: values.name.trim(),
      description: values.description.trim(),
      permissionIds: effectivePermissionIds,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader title={title} action={{ type: "none" }} />

      <Form {...form}>
        <form
          className="m-4 space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-x-5 rounded-lg bg-white pb-3">
            <div className="col-span-full border-b-2 border-primary px-5 py-3">
              <p className="text-lg font-semibold">{title}</p>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-full w-full px-5 py-3">
                  <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter role name"
                      disabled={isPending || readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full w-full px-5 py-3">
                  <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Enter description"
                      disabled={isPending || readOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Permissions */}
          <div className="rounded-lg bg-white pb-3">
            <div className="col-span-full border-b-2 px-5 py-3">
              <p className="flex items-center gap-2 text-lg font-semibold">
                <ShieldPlus className="size-5" />
                Permissions
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-left font-semibold">Module</th>
                    <th className="p-3 text-center font-semibold">
                      All Access
                    </th>
                    <th className="p-3 text-center font-semibold">Read</th>
                    <th className="p-3 text-center font-semibold">Update</th>
                    <th className="p-3 text-center font-semibold">Create</th>
                    <th className="p-3 text-center font-semibold">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedPermissions.map((group) => (
                    <Fragment key={group.id}>
                      <tr className="bg-muted/40">
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedModules((prev) => ({
                                ...prev,
                                [group.id]: !prev[group.id],
                              }))
                            }
                            className="flex items-center gap-2"
                          >
                            {group.childrenModules.length > 0 ? (
                              expandedModules[group.id] ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )
                            ) : (
                              <span className="w-4" />
                            )}
                            <span className="font-bold">{group.name}</span>
                          </button>
                        </td>

                        <td className="p-3 text-center">
                          <Checkbox
                            checked={isChecked(getIdsForGroupAllAccess(group))}
                            disabled={readOnly}
                            onCheckedChange={(checked) => {
                              toggleIds(
                                getIdsForGroupAllAccess(group),
                                Boolean(checked)
                              )
                              applyGroupAllToChildrenWithoutIds(
                                group,
                                Boolean(checked)
                              )
                            }}
                          />
                        </td>
                        {ACTIONS.map((action) => (
                          <td key={action} className="p-3 text-center">
                            <Checkbox
                              checked={isChecked(
                                getIdsForGroupByAction(group, action)
                              )}
                              disabled={readOnly}
                              onCheckedChange={(checked) => {
                                toggleIds(
                                  getIdsForGroupByAction(group, action),
                                  Boolean(checked)
                                )
                                applyGroupActionToChildrenWithoutIds(
                                  group,
                                  action,
                                  Boolean(checked)
                                )
                              }}
                            />
                          </td>
                        ))}
                      </tr>

                      {expandedModules[group.id] &&
                        group.childrenModules.map((child) => (
                          <tr key={child.id} className="bg-white">
                            <td className="p-3 text-foreground/70">
                              <span className="pl-8">{child.name}</span>
                            </td>
                            <td className="p-3 text-center">
                              <Checkbox
                                checked={getChildAllAccessChecked(child, group)}
                                disabled={readOnly}
                                onCheckedChange={(checked) => {
                                  ACTIONS.forEach((a) =>
                                    toggleChildAction(
                                      child,
                                      a,
                                      Boolean(checked)
                                    )
                                  )
                                }}
                              />
                            </td>
                            {ACTIONS.map((action) => (
                              <td key={action} className="p-3 text-center">
                                <Checkbox
                                  checked={getChildActionChecked(
                                    child,
                                    action,
                                    group
                                  )}
                                  disabled={readOnly}
                                  onCheckedChange={(checked) =>
                                    toggleChildAction(
                                      child,
                                      action,
                                      Boolean(checked)
                                    )
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                    </Fragment>
                  ))}

                  {groupedPermissions.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-6 text-center text-muted-foreground"
                      >
                        No permissions available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {form.formState.errors.permissionIds && (
              <p className="px-5 py-1 text-sm text-destructive">
                {form.formState.errors.permissionIds.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 rounded-lg bg-white p-4">
            {readOnly ? (
              <Button
                size="lg"
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Back
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button size="lg" type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 size-5 animate-spin" />}
                  {defaultValues ? "UPDATE" : "CREATE"}
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

export default RoleForm
